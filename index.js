const secrets = require('./secrets.json'); 
const functions = require('firebase-functions');
const accountSid = secrets.twilio_sid; 
const authToken = secrets.twilio_authtoken;
const client = require('twilio')(accountSid, authToken);

exports.sendSMS = functions.https.onCall(async (body, context) => {
    console.log(body); 

    const {userName, userNumber, contactName, contactNumber, location, elapsedTime} = body; 
    
    if (!(body.hasOwnProperty("userName") && body.hasOwnProperty("userNumber") && body.hasOwnProperty("contactName") && body.hasOwnProperty("contactNumber")
            && body.hasOwnProperty("location") && body.hasOwnProperty("elapsedTime"))) {
        throw new functions.https.HttpsError('invalid-argument', "Error. You must specify all fields userName, userNumber, contactName, contactNumber, and location.")
    }

    const text = `Hi ${contactName}, ${userName} has been outside and motionless for over ${elapsedTime} minutes at ${location}. You can contact them at ${userNumber}`; 

    return client.messages.create({
        body: text, 
        from: "+12057089754", 
        to: contactNumber
    })
    .then((message) => {
        return {"message_id": message.sid}
    })
    .catch(() =>  {
        throw new functions.https.HttpsError('unknown', "An error occurred with the twilio request")
    }); 

});