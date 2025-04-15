const arrow = document.getElementById('arrow');
const infoContainer = document.getElementById('info');
const inputIP = document.getElementById('inputIP');

const API_KEY = 'at_5JFgV4ngaQmpUPdhMWCF1IcITZUo0';

// Inicializar mapa
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Mostrar datos y actualizar mapa
function mostrarDatos(data) {
  const { ip, isp, location } = data;
  const { city, region, country, timezone, lat, lng } = location;

  infoContainer.innerHTML = `
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">IP ADDRESS</h6>
        <p class="text-lg font-semibold">${ip}</p>
    </div>
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">LOCATION</h6>
        <p class="text-lg font-semibold">${city}, ${region}, ${country}</p>
    </div>
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">TIMEZONE</h6>
        <p class="text-lg font-semibold">${timezone}</p>
    </div>
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">ISP</h6>
        <p class="text-lg font-semibold">${isp}</p>
    </div>
  `;

  map.setView([lat, lng], 13);
  L.marker([lat, lng]).addTo(map);
}

// Obtener IP pública al cargar y mostrar datos
function obtenerIPPorDefecto() {
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`)
    .then(res => res.json())
    .then(data => mostrarDatos(data))
    .catch(err => {
      console.error(err);
      infoContainer.textContent = "No se pudo obtener la información de tu IP.";
    });
}

// Buscar por IP ingresada
function buscarIP() {
  const ip = inputIP.value.trim();
  if (!ip) return alert("Por favor ingresa una IP.");

  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ip}`)
    .then(res => res.json())
    .then(data => {
      if (!data.location || !data.location.lat || !data.location.lng) {
        infoContainer.textContent = "IP no válida o no encontrada.";
        return;
      }
      mostrarDatos(data);
    })
    .catch(err => {
      console.error(err);
      infoContainer.textContent = "Error al obtener los datos.";
    });
}

arrow.addEventListener('click', buscarIP);

document.addEventListener('DOMContentLoaded', obtenerIPPorDefecto);
