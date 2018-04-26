var Alexa = require('alexa-sdk');
var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
var dynamodbstreams = new AWS.DynamoDBStreams({apiVersion: "2012-08-10"});

var table = "DeviceLocation";
var title;
var userID = "test";
var alexa;
var APP_ID = "amzn1.ask.skill.be17ef63-f20c-4f6f-8169-f130d5ebdf85";


exports.handler = (event, context, callback) => {
    alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    console.log('Getting Data');
    getData();
    console.log('Got Data');
    //alexa.registerHandlers(handlers);
    //alexa.execute();     
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('RememberName');
    },
    'RememberName': function () {        
        console.log("About to speak: " + title);
        this.response.speak('You are in the ' + title)
        this.emit(':responseReady'); 
    },
};

function getData() {
    var ddb = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
    var params = {
        TableName: table, 
        Key:{
            'UserId': userID,
            }
    };      
    ddb.get(params, function(err, data) {
        if (err) {
            console.log('error: ' + JSON.stringify(err, null, 2))
        }else{
           title = data.Item.room;
           console.log(data);
           console.log(title);
           alexa.registerHandlers(handlers);
           alexa.execute();            
        }
    });
}
