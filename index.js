var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

    'LaunchRequest': function () {
        this.emit(':ask', 'Hello World! This is a simple custom skill.');
    },
  
    'RememberName': function () {
    var nameSlot = this.event.request.intent.slots.name.value;
    var name;
    if (nameSlot) {
      name = nameSlot;
    }

    if (name) {
      this.attributes['userName'] = name;
      this.emit(':tell', `Nice to meet you ${name}! I'll greet you by name the next time we talk`);
    } else {
      this.emit(':ask', `Sorry, I don\'t recognise that name!`, `'Tell me your name by saying: My name is, and then your name.'`);
    }
  }

};
