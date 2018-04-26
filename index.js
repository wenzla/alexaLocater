// Libraries need for this node.js app
var Alexa = require('alexa-sdk');
var AWS = require("aws-sdk");
// Global variables to be used in the application
var table = "DeviceLocation";
var roomTitle;
var deviceId = "test";
var alexa;
var APP_ID = "amzn1.ask.skill.be17ef63-f20c-4f6f-8169-f130d5ebdf85";
var getVal;

// Entry point of the app
exports.handler = (event, context, callback) => {
    alexa = Alexa.handler(event, context, callback);
    // If app id is different, the application will not run.
    alexa.appId = APP_ID;
    // Gets device id of the alexa
    deviceId = event.context.System.device.deviceId;
    console.log("device Id: " + event.context.System.device.deviceId);
    getData();
    console.log('Got Data');  
};

// These are basically routes that occur when you say a certain phrase.
const handlers = {
    //  This always occurs first.
    'NewSession': function () {
        console.log('New Session Intent');
        // check for session data
        if(getVal){
            var returnUserString = 'This device is in the ' + getVal.Item.room;
            this.emit(':ask', returnUserString);
        }{
          // first time user
          this.emit(':ask', 'You have not set up a room. To set up a name, say, you are in the. and the room i am in.');
        }
    },    
    // This route occurs when you say 'set up device'
    'SetupIntent': function () {
        console.log('Setup Intent');
        this.emit(':ask', 'You have not set up a room. To set up a name, say, you are in the, and the room i am in.');
    },
    // This route occurs when you say 'you are in the {room}'
    'RememberName': function () {      
        console.log('RememberName Intent');    
        // gets the {room} value when you say 'you are in the {room}'
        var nameSlot = this.event.request.intent.slots.name.value;
        console.log('User said: ' + nameSlot) 
        // set up dynamodb
        var ddb = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
        var params = {
            TableName: table, 
            Item:{
                "UserId": deviceId,
                "room": nameSlot,
                }
        };      
        // puts user response in dynamodb
        ddb.put(params, function(err, data) {
            if (err) {
                console.log('error: ' + JSON.stringify(err, null, 2));
            }else{
               console.log('placed data in db');            
            }
        });
        // finishes application
        this.emit(':tell', 'Room is set up, Goodbye!');
        this.emit(':responseReady'); 
    },
    // This is like a defualt route when all the other routes do not trigger
    'Unhandled': function () {
        var HelpMessage = 'In unhandled state, please say cancel';
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    // This route is a built in route that occurs when you say 'cancel'
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", "Application canceled.");
    },
    // This route is a built in route that occurs when you say 'help'
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", 'Say, set up device, to set new location');
    },
    // This route is a built in route that occurs when you say 'stop'
    "AMAZON.StopIntent": function() {
        this.emit(":tell", "Application stopped.");
    }
};

// Function that gets the name of the alexa in dyanamodb to check if it already there or not.
function getData() {
    var ddb = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
    var params = {
        TableName: table, 
        Key:{
            'UserId': deviceId,
            }
    };      
    // query the db
    ddb.get(params, function(err, data) {
        if (err) {
            console.log('error: ' + JSON.stringify(err, null, 2));
        }else{
           console.log(data);
           // If this statement is true, the key is already in the table.
           if(data.Item != undefined){
               roomTitle = data.Item.room;
               getVal = data;
           } else {
                console.log('Not a valid id.')
           }
           console.log(getVal);
           // This part starts the actual 'voice interation' part of the app.
           alexa.registerHandlers(handlers);
           alexa.execute();            
        }
    });
}
