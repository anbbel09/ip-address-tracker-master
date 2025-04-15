const arrow = document.getElementById('arrow');
const infoContainer = document.getElementById('info');
const inputIP = document.getElementById('inputIP');

// Inicializar mapa
const map = L.map('map').setView([0, 0], 2); // Vista más general al principio
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Reutilizable: mostrar info y actualizar mapa
function mostrarDatos(data) {
  const { latitude, longitude, city, region, country_name, org, timezone, ip } = data;

  infoContainer.innerHTML = `
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">IP ADDRESS</h6>
        <p class="text-lg font-semibold">${ip}</p>
    </div>
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">LOCATION</h6>
        <p class="text-lg font-semibold">${city}, ${region}, ${country_name}</p>
    </div>
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">TIMEZONE</h6>
        <p class="text-lg font-semibold">${timezone}</p>
    </div>
    <div class="text-center">
        <h6 class="text-[10px] font-medium text-gray-600">ISP</h6>
        <p class="text-lg font-semibold">${org}</p>
    </div>
  `;

  map.setView([latitude, longitude], 13);
  L.marker([latitude, longitude]).addTo(map);
}

// Obtener IP pública al cargar
function obtenerIPPorDefecto() {
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => fetch(`https://ipapi.co/${data.ip}/json/`))
    .then(res => res.json())
    .then(data => {
      if (!data.latitude || !data.longitude) throw new Error("Ubicación no disponible.");
      mostrarDatos(data);
    })
    .catch(err => {
      console.error(err);
      infoContainer.textContent = "No se pudo obtener la información de tu IP.";
    });
}

// Buscar por IP ingresada
function buscarIP() {
  const ip = inputIP.value.trim();
  if (!ip) return alert("Por favor ingresa una IP.");

  fetch(`https://ipapi.co/${ip}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.error || !data.latitude || !data.longitude) {
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

// Ejecutar al cargar la página
obtenerIPPorDefecto();
