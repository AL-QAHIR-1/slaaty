const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(require('cors')());

const logFile = path.join(__dirname, 'locations.log');

app.post('/location', (req, res) => {
  const { clientId, latitude, longitude, timestamp } = req.body;
  const serverTime = new Date().toISOString();

  if (!clientId || !latitude || !longitude || !timestamp) {
    return res.status(400).send('Missing required fields');
  }

  const log = `${timestamp} (Client) | ${serverTime} (Server) - ClientID: ${clientId} - Latitude: ${latitude}, Longitude: ${longitude}\n`;

  console.log('Received location:', log.trim());

  fs.appendFile(logFile, log, err => {
    if (err) {
      console.error('Failed to save location:', err);
      res.status(500).send('Failed to save location');
    } else {
      res.send('Location saved successfully');
    }
  });
});
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
