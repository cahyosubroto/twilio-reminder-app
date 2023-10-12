import { Twilio } from 'twilio';
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const message = params.get("message");
  const time = params.get("time");
  console.log(time, "Time in miliseconds");

  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const toPhoneNumber = process.env.TWILIO_YOUR_PHONE_NUMBER;

  // Create a Twilio client
  const client = new Twilio(accountSid, authToken);

  try {
    // Function to send an SMS message
    const sendSMS = (messageFromCall) => {
      return client.messages
        .create({
          body: `${messageFromCall}`,
          from: fromPhoneNumber,
          to: toPhoneNumber,
        })
        .then((message) => {
          console.log("Message sent:", message.sid);
          return NextResponse.json({ message: 'SMS sent successfully' });
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          return NextResponse.json({ error: 'Failed to send SMS' });
        });
    };

    // Function to make a call and send messages
    const makeCall = (messageSchedule) => {
      return client.calls
        .create({
          twiml: `<Response><Say>Welcome to the Twilio call with messages example. Your today reminder is ${messageSchedule}</Say></Response>`,
          from: fromPhoneNumber,
          to: toPhoneNumber,
        })
        .then((call) => {
          console.log(`Call SID: ${call.sid}`);
          // Return the result of sending the SMS
          return sendSMS(messageSchedule);
        })
        .catch((error) => {
          console.error(`Error making call: ${error.message}`);
          return NextResponse.json({ error: 'Failed to call and send SMS' });
        });
    };

    // Function to schedule a call and send a message
    const scheduleCallAndSendSMS = (messageForSchedule, delayInMiliseconds) => {
      setTimeout(() => {
        // Call makeCall with the message to initiate the call and send SMS
        // sendSMS(messageForSchedule);
        makeCall(messageForSchedule);
      }, delayInMiliseconds);
    };

    // You can call scheduleCallAndSendSMS to initiate the process
    scheduleCallAndSendSMS(message, time);

    return NextResponse.json({ message: 'Call and sent message successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send SMS' });
  }
}
