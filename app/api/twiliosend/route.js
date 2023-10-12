import { Twilio } from 'twilio';
import { NextResponse } from "next/server";

export async function GET(req, res) {
  // const { message } = parse(req.url, true);
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const message = params.get("message");
  console.log(message, "data message")

  const accountSid = 'AC656458a960f2caefbcd7942e6efcae4b';
  const authToken = 'db4fc39d2add636c455c05ec6ea1eb68';
  const fromPhoneNumber = '+12565677801';
  const toPhoneNumber = '+6281263589080';

  const client = new Twilio(accountSid, authToken);

  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    });

    console.log('Message sent:', sentMessage.sid);
    return NextResponse.json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send SMS' });
  }
}
