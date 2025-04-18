const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_Auth_Token;
const client = new twilio(accountSid, authToken);

const fromNumber = 'whatsapp:+14155238886'; // Twilio sandbox number

async function sendWhatsAppMessage(to, message, mediaUrl) {
  console.log(`Sending to ${to} with body="${message}" and mediaUrl="${mediaUrl}"`);
  const msgData = {
    from: fromNumber,
    to: `whatsapp:${to}`,
  };

  if (mediaUrl && mediaUrl.trim()) {
    msgData.mediaUrl = [mediaUrl.trim()];
    if (message && message.trim()) {
      msgData.body = message;
    }
  } else if (message && message.trim()) {
    msgData.body = message;
  } else {
    throw new Error('Either message or mediaUrl is required');
  }

  return client.messages.create(msgData);
}

async function bulkSend(req, res) {
  const { numbers, message, mediaUrl } = req.body;
  const results = [];

  for (let i = 0; i < numbers.length; i++) {
    try {
       console.log(`Sending to: ${numbers[i]}, mediaUrl: ${mediaUrl}`);
      const result = await sendWhatsAppMessage(numbers[i], message, mediaUrl);
      results.push({ to: numbers[i], status: 'sent', sid: result.sid });
      await new Promise(resolve => setTimeout(resolve, 1500)); // optional delay
    } catch (e) {
      console.error('Sending failed:', e.message);
      results.push({ to: numbers[i], status: 'failed', error: e.message });
    }
  }

  res.json(results);
}

module.exports = { bulkSend };
