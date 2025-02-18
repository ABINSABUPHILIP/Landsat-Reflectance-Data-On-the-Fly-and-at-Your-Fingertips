# Landsat-Reflectance-Data-On-the-Fly-and-at-Your-Fingertips
2024 NASA Space Apps Challenge

## Overview
**Landsat Reflectance Data: On the Fly and at Your Fingertips** is a web-based application that enables users to compare ground-based spectral measurements with Landsat Surface Reflectance (SR) data. Users can define a target location, receive notifications about Landsat overpasses, and access corresponding SR data for validation and research purposes.

## Features
- **Define Target Location**: Users can specify their location via latitude/longitude, place name, or map click.
- **Landsat Overpass Notifications**: Get alerts when Landsat 8 or 9 passes over the selected location.
- **Access and Display Landsat Data**: Retrieve and visualize spectral reflectance values from NASA’s Earthdata API.
- **Cloud Coverage and Scene Metadata**: Select images based on cloud cover percentage and view metadata such as acquisition time, path, and row.
- **Spectral Signature Visualization**: Compare Landsat data with ground-based measurements using interactive charts.
- **Downloadable Data**: Export retrieved SR data in CSV format.

## Tech Stack
### Frontend
- **HTML, CSS, JavaScript**: Core web technologies for UI development.
- **Leaflet.js**: Interactive maps for location selection.
- **Chart.js**: Graphs and visualizations for spectral data.
- **Bootstrap**: Responsive and mobile-friendly design.

### Backend
- **Node.js & Express.js**: Server-side logic and API handling.
- **SQLite/MySQL**: Database for storing user locations and overpass schedules.
- **NASA Earthdata API**: Fetching Landsat SR data.
- **Nodemailer**: Sending email notifications for upcoming overpasses.
- **Axios**: Handling API requests.

### Data Sources
- **NASA Landsat Data**: Primary data for SR measurements.
- **OpenStreetMap API**: For map base layers and location selection.

## Installation
### Prerequisites
Ensure you have **Node.js** and **npm** installed.

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/ABINSABUPHILIP/Landsat-Reflectance-Data.git
   cd Landsat-Reflectance-Data
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file and add:
   ```sh
   NASA_API_KEY=your_nasa_api_key
   PORT=3000
   ```

4. **Run the Application**
   ```sh
   node server.js
   ```
   The server should now be running at `http://localhost:3000/`.

## Usage
1. Open the application in your browser.
2. Select a target location on the map or enter latitude/longitude.
3. Choose cloud cover preferences.
4. Get notified about Landsat overpasses.
5. Retrieve and visualize SR data.
6. Download the data for analysis.

## API Routes
- **POST /api/add-location**: Stores user input and preferences.
- **GET /api/get-landsat-data**: Fetches SR data from NASA API.

## Future Enhancements
- **Integration with Sentinel-2 data**
- **Machine learning-based cloud filtering**
- **Offline mode for cached data access**
- **AI models for optimal ground measurement predictions**
- **Automated cloud filtering for enhanced accuracy**
- **Notifications via email or SMS for overpass alerts**

## Notifications and Scheduling
- **Cron jobs** will be used in Node.js to check for upcoming overpasses and notify users in advance.

## License
This project is licensed under the MIT License.

## Contributors
- Abin SabuPhilip (@ABINSABUPHILIP)

## Acknowledgments
This project uses NASA’s **Earthdata API** and **Landsat satellite imagery**.

