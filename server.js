const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE locations (email TEXT, lat REAL, lon REAL, cloudCover INTEGER)");
});

// API endpoints
app.post('/api/add-location', (req, res) => {
  const { email, lat, lon, cloudCover } = req.body;
  db.run("INSERT INTO locations (email, lat, lon, cloudCover) VALUES (?, ?, ?, ?)", [email, lat, lon, cloudCover], (err) => {
    if (err) {
      return res.status(500).send("Error storing location");
    }
    res.send("Location stored successfully");
  });
});

app.get('/api/get-landsat-data', async (req, res) => {
  const { lat, lon, cloudCover } = req.query;
  try {
    const response = await axios.get(`https://api.nasa.gov/landsat/sr?lat=${lat}&lon=${lon}&cloudCover=${cloudCover}&api_key=${process.env.NASA_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error retrieving Landsat data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
