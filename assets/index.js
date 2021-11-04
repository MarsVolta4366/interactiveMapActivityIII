let map

// Get users coordinates
async function getCoords(){
    let pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    buildMap(pos)
}

function buildMap(pos) {
    // Set view and add marker at users location
    map = L.map("map").setView([pos.coords.latitude, pos.coords.longitude], 15)
    let userLocationMarker = L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map)
    userLocationMarker.bindPopup("<b>You are here</b>").openPopup()
    
    // Add OpenStreetMap tiles:
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '10',
    }).addTo(map)

    // Get users business choice
    let submitBtn = document.getElementById("submit")
    submitBtn.addEventListener("click", event => {
        let userChoice = document.getElementById("business").value

        // Call getBusinesses and pass lat, long, and business choice
        getBusinesses(pos.coords.latitude, pos.coords.longitude, userChoice)
        event.preventDefault()
    })
}

async function getBusinesses(lat, long, userChoice) {
    const clientId = "0W4JLVIEFEBKBFIUIDX1ZSXUOOPSIMJKJWRBQQEC5T54BLFT"
    const clientSecret = "G5NPRBJLKERF0I1G5HZYFWECPUSTYYKZ031FLOU5ECVDTJEA"
    const limit = 5
    
    // Get array of businesses from API and save to businessList variable
    let response = await fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&limit=${limit}&ll=${lat},${long}&query=${userChoice}`)
    let data = await response.json()
    let businessList = data.response.groups[0].items

    // Add each business to the map
    let fitBoundsArray = [[lat, long]]
    businessList.forEach((business) => {
        let bussinessMarker = L.marker([business.venue.location.lat, business.venue.location.lng]).addTo(map)
        bussinessMarker.bindPopup(`<b>${business.venue.name}</b>`);
        fitBoundsArray.push([business.venue.location.lat, business.venue.location.lng])
    })

    // Zoom out map to show all markers
    map.fitBounds(fitBoundsArray)
}

getCoords()
