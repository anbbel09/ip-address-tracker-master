let arrow = document.getElementById('arrow');
console.log(arrow);

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function buscarIP() {
    const ip = document.getElementById('inputIP').value.trim();

    if (!ip) {
        alert("Por favor ingresa una IP.");
        return;
    }

    fetch(`https://ipapi.co/${ip}/json/`)
        .then(res => res.json())
        .then(data => {
            if (data.error || !data.latitude || !data.longitude) {
                document.getElementById("info").textContent = "Ingrese una IP";
                return;
            }

            const { latitude, longitude, city, region, country_name, org, timezone, ip } = data;

            // Actualizar texto
            document.getElementById("info").innerHTML = `
                <div class="text-center">
                    <h6 class=" text-[10px] font-medium text-gray-600">IP ADDRESS</h6>
                    <p class="text-lg font-semibold">${ip}</p>
                </div>
                <div class="text-center">
                    <h5 class=" text-[10px] font-medium text-gray-600">LOCATION</h5>
                    <p class="text-lg font-semibold">${city}</p>
                </div>
                <div class="text-center">
                    <h6 class=" text-[10px] font-medium text-gray-600">TIMEZONE</h6>
                    <p class="text-lg font-semibold">${timezone}</p>
                </div>
                <div class="text-center">
                    <h6 class=" text-[10px] font-medium text-gray-600">ISP</h6>
                    <p class="text-lg font-semibold">${org}</p>
                </div>
            `;

            // mover el mapa a la ubicación
            map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(map);
        })
        .catch(err => {
            console.error(err);
            document.getElementById("info").textContent = "Error al obtener los datos.";
        });
}

arrow.addEventListener('click', ()=> {

    console.log('hola');
    buscarIP();

});