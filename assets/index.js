// Get users coordinates
async function getCoords(){
    let pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    buildMap(pos)
}

function buildMap(pos) {

    console.log(`Lat: ${pos.coords.latitude}, Long: ${pos.coords.longitude}`)

    // Set view and add marker at users location
    var map = L.map("map").setView([pos.coords.latitude, pos.coords.longitude], 0);
    var userLocationMarker = L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
    userLocationMarker.bindPopup("<b>You are here</b>").openPopup();
    
    // Add OpenStreetMap tiles:
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '15',
    }).addTo(map)

    // Get users business choice
    let submitBtn = document.getElementById("submit")
    submitBtn.addEventListener("click", event => {
        let userChoice = document.getElementById("business").value
        alert("User choice: " + userChoice)
    })
}

getCoords()