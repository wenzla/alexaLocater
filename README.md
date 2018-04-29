# alexaLocater

## How to use
Zip the code and dependencies into one folder and upload it to the amazon lambda console.

Create an Alexa skill that has a 'RememberName' intent and a 'SetupIntent' intent.
The RememberName intent has a slot called name that uses the Amazon.ROOM slot.

The RememberName intent has the following invocations: 
 - Your location is the {name}
 - Your location is {name}
 - You are in the {name}
 - Your name is {name}
 
The SetupIntent intent has the following invocations:
 - set up a device
 - set up new device
 - set up device
 
A dynamodb is also needed for persistance.  Call the db 'DeviceLocation' with a key of 'UserId' and hook up this table to your app.
 
## Information

This app will let the user set up room names for the alexa and then remembers this for them.