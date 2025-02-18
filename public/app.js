// Initialize Chart.js
let spectralChart;
const ctx = document.getElementById('spectralChart').getContext('2d');

document.addEventListener('DOMContentLoaded', () => {
  // Initialize map
  const map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  map.on('click', (e) => {
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lon').value = e.latlng.lng;
  });

  // Initialize chart
  if (ctx) {
    spectralChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Spectral Reflectance',
          data: [],
          borderColor: '#007bff',
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Reflectance'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Band'
            }
          }
        }
      }
    });
  }

  // Handle form submission
  document.getElementById('location-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;
    const cloudCover = document.getElementById('cloudCover').value;

    try {
      const response = await fetch('/api/add-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, lat, lon, cloudCover })
      });
      const result = await response.json();
      if (result.overpassTimes.length > 0) {
        alert(`Location stored successfully. ${result.overpassTimes.length} overpasses found.`);
      } else {
        alert('Location stored successfully. No upcoming overpasses found.');
      }
      
      // Fetch and display Landsat data
      try {
        const dataResponse = await fetch(`/api/get-landsat-data?lat=${lat}&lon=${lon}&cloudCover=${cloudCover}`);
        const landsatData = await dataResponse.json();
        
        // Update chart
        spectralChart.data.labels = landsatData.spectralData.map(b => `Band ${b.band}`);
        spectralChart.data.datasets[0].data = landsatData.spectralData.map(b => b.reflectance);
        spectralChart.update();
        
        // Display metadata
        const metadataDiv = document.getElementById('metadata');
        metadataDiv.innerHTML = `
          <p><strong>Acquisition Date:</strong> ${landsatData.metadata.acquisitionDate}</p>
          <p><strong>Path/Row:</strong> ${landsatData.metadata.path}/${landsatData.metadata.row}</p>
          <p><strong>Cloud Cover:</strong> ${landsatData.metadata.cloudCover}%</p>
        `;
        
        // Enable download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => downloadData(landsatData);
      } catch (error) {
        console.error('Error fetching Landsat data:', error);
        alert('Error fetching Landsat data');
      }
    } catch (error) {
      console.error('Error submitting location:', error);
      alert('Error submitting location');
    }
  });
});

// Function to download data as CSV
function downloadData(data) {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Band,Reflectance\n" 
    + data.spectralData.map(b => `${b.band},${b.reflectance}`).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "landsat_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
