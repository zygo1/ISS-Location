//Create map and tiles
const map = L.map('map').setView([0, 0], 1); //.setView([latitude, longitude],zoom)
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);


//Satellite----------------
var mapLink = '<a href="http://www.esri.com/">Esri</a>';
var wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; ' + mapLink + ', ' + wholink,
    maxZoom: 20,
}).addTo(map);


//Set custom icon to the marker
const myIcon = L.icon({
    iconUrl: 'icons/iss.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16],
});

//Reset marker to 0,0
const marker = L.marker([0, 0], { icon: myIcon }).addTo(map);


const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
const velocityData = [];
let sum = 0;


async function getISS() {
    const response = await fetch(api_url);
    const data = await response.json();
    const { latitude, longitude, altitude, velocity, visibility } = data;
    sum += velocity;
    velocityData.push(velocity);
    marker.setLatLng([latitude, longitude]);
    locationISS(latitude, longitude, visibility);
    printAttributes(velocityData, latitude, longitude, altitude, velocity, sum);
    setTimeout(getISS, 5000);
}

function locationISS(latitude, longitude, visibility) {
    if (latitude > 1 && longitude < 0) {
        document.getElementById('pos').textContent = "North-Western Hemisphere"
    }
    else if (latitude > 1 && longitude > 0) {
        document.getElementById('pos').textContent = "North-Eastern Hemisphere"
    }
    else if (latitude < -1 && longitude < 0) {
        document.getElementById('pos').textContent = "South-Western Hemisphere"
    }
    else if (latitude < -1 && longitude > 0) {
        document.getElementById('pos').textContent = "South-Eastern Hemisphere"
    }
    else if (latitude >= -1.0 && latitude <= 1.0) {
        document.getElementById('pos').textContent = "Equator"
    }

    if (visibility === "daylight") {
        document.getElementById('time').className = "fa-solid fa-sun"
    }
    else {
        document.getElementById('time').className = "fa-solid fa-moon"
    }
}

function printAttributes(velocityData, latitude, longitude, altitude, velocity, sum) {
    document.getElementById("lat").textContent = latitude.toFixed(4);
    document.getElementById("lon").textContent = longitude.toFixed(4);
    document.getElementById("alt").textContent = altitude.toFixed(3);
    document.getElementById("vel").textContent = velocity.toFixed(3);
    document.getElementById("ave").textContent = (sum / velocityData.length).toFixed(3);
    document.getElementById("max").textContent = (Math.max(...velocityData).toFixed(3));
    document.getElementById("min").textContent = (Math.min(...velocityData).toFixed(3));
}

getISS();
