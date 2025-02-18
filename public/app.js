document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  map.on('click', (e) => {
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lon').value = e.latlng.lng;
  });

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
      const result = await response.text();
      alert(result);
    } catch (error) {
      alert('Error submitting location');
    }
  });
});
