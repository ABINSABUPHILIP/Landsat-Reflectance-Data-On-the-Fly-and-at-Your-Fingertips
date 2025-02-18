const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const { DateTime } = require('luxon');
require('dotenv').config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to calculate overpass times
async function calculateOverpassTimes(lat, lon) {
  try {
    const response = await axios.get(`https://api.nasa.gov/landsat/acquisition?lat=${lat}&lon=${lon}&api_key=${process.env.NASA_API_KEY}`);
    return response.data.map(pass => ({
      date: DateTime.fromISO(pass.date).toFormat('yyyy-MM-dd HH:mm'),
      satellite: pass.satellite
    }));
  } catch (error) {
    console.error('Error calculating overpass times:', error);
    return [];
  }
}

// Function to send notification email
async function sendNotification(email, overpassTimes) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Upcoming Landsat Overpasses',
    text: `Upcoming Landsat overpasses:\n\n${overpassTimes.map(pass => `${pass.date} (${pass.satellite})`).join('\n')}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent to:', email);
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

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
app.post('/api/add-location', async (req, res) => {
  const { email, lat, lon, cloudCover } = req.body;
  
  try {
    // Store location in database
    db.run("INSERT INTO locations (email, lat, lon, cloudCover) VALUES (?, ?, ?, ?)", 
      [email, lat, lon, cloudCover], 
      async (err) => {
        if (err) {
          return res.status(500).send("Error storing location");
        }
        
        // Calculate overpass times
        const overpassTimes = await calculateOverpassTimes(lat, lon);
        
        // Send notification if overpasses found
        if (overpassTimes.length > 0) {
          await sendNotification(email, overpassTimes);
        }
        
        res.send({
          message: "Location stored successfully",
          overpassTimes: overpassTimes
        });
      }
    );
  } catch (error) {
    console.error('Error in add-location:', error);
    res.status(500).send("Internal server error");
  }
});

app.get('/api/get-landsat-data', async (req, res) => {
  const { lat, lon, cloudCover } = req.query;
  try {
    const response = await axios.get(`https://api.nasa.gov/landsat/sr?lat=${lat}&lon=${lon}&cloudCover=${cloudCover}&api_key=${process.env.NASA_API_KEY}`);
    
    // Format data for visualization and download
    const formattedData = {
      metadata: {
        acquisitionDate: response.data.meta.acquisition_date,
        path: response.data.meta.path,
        row: response.data.meta.row,
        cloudCover: response.data.meta.cloud_cover
      },
      spectralData: response.data.data.map(band => ({
        band: band.band,
        reflectance: band.reflectance
      }))
    };
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error retrieving Landsat data:', error);
    res.status(500).send("Error retrieving Landsat data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
