const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { bulkSend } = require('./twilio.controller');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-bulk', bulkSend);

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
