const api = {
  key: 'at_7TVIrlU1PamgIMpZH7E9yp8xPuvXy',
  url: `https://geo.ipify.org/api/v2/country,city?apiKey=`,
};

async function init() {
  const ipInfo = await getGeopIpInfo();
  updateMap(ipInfo.location);
}

async function getGeopIpInfo() {
  const response = await fetch(api.url + api.key);
  return await response.json();
}

function updateMap(location) {
  const { lat, lng } = location;
  const map = L.map('map').setView([lat, lng], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const marker = L.marker([lat, lng]).addTo(map);
}

document.addEventListener('DOMContentLoaded', init);
