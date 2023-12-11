const api = {
  key: 'at_7TVIrlU1PamgIMpZH7E9yp8xPuvXy',
  url: `https://geo.ipify.org/api/v2/country,city?apiKey=`,
};

const ipAddressInput = document.querySelector('#ip-address-input');
const inputIcon = document.querySelector('#input-icon');

// leaf api init
let map = L.map('map', { zoomControl: false }).setView([0, 0], 18);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 16,
}).addTo(map);

let myIcon = L.icon({
  iconUrl: '/images/icon-location.svg',
});
let marker = L.marker([0, 0], { icon: myIcon }).addTo(map);

async function searchIpAddress() {
  const input = ipAddressInput.value;

  if (isValidIpAddress(input)) {
    // Search by ipAddress
    const ipInfo = await getGeoIpInfo(`&ipAddress=${input}`);
    updateMap(ipInfo.location);
    updateDom(ipInfo);
  } else if (isValidDomain(input)) {
    // Search by domain
    const ipInfo = await getGeoIpInfo(`&domain=${input}`);
    updateMap(ipInfo.location);
    updateDom(ipInfo);
  }
}

// Show user ip address info on page load
async function init() {
  const ipInfo = await getGeoIpInfo();
  updateMap(ipInfo.location);
  updateDom(ipInfo);
}

// Fetching data from geo api
async function getGeoIpInfo(queryStringParam = '') {
  const response = await fetch(api.url + api.key + queryStringParam);
  return await response.json();
}

// Check for a valid ip address like 194.71.227.168
function isValidIpAddress(ipAddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipAddress
    )
  ) {
    return true;
  }
  return false;
}

// Check for a valid domain like amazon.com
function isValidDomain(domain) {
  if (
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)
  ) {
    return true;
  }
  return false;
}

function updateMap(location) {
  const { lat, lng } = location;
  map.setView([lat, lng], 18);
  L.marker([lat, lng], { icon: myIcon }).addTo(map);
}

function updateDom(info) {
  document.querySelector('#ip').textContent = info.ip;
  document.querySelector(
    '#location'
  ).textContent = `${info.location.city}, ${info.location.country} ${info.location.postalCode}`;
  document.querySelector(
    '#timezone'
  ).textContent = `UTC-${info.location.timezone.slice(1)}`;
  document.querySelector('#isp').textContent = info.isp;
}

document.addEventListener('DOMContentLoaded', init);
inputIcon.addEventListener('click', searchIpAddress);
