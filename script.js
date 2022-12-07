"use strict"
//!Leaflet Map Settings-------------------------------------------------
//init map
let map = L.map('map').setView([0, 0], 1); //.setView([latitude, longitude],zoom)
let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
let attributionSat = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

//Create map tiles
let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

//Create satellite tiles
let mapLink = '<a href="http://www.esri.com/">Esri</a>';
let tileUrlSat = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
L.tileLayer(
    tileUrlSat, {
    attribution: '&copy; ' + mapLink + ', ' + attributionSat,
    maxZoom: 20,
    minZoom: 1,
    noWrap: true,
}).addTo(map);

//Set custom icons to the markers
//White for satellite map
const myIcon = L.icon({
    iconUrl: 'icons/satelliteWhite.png',
    iconSize: [38, 38],
    iconAnchor: [25, 16],
});

//Black for simple map
const myIcon2 = L.icon({
    iconUrl: 'icons/satellite.png',
    iconSize: [38, 38],
    iconAnchor: [25, 16],
});

//Create Map Bounds
let southWest = L.latLng(-90, -180),
    northEast = L.latLng(90, 180);
let bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});

//Reset marker to 0,0 
const marker = L.marker([0, 0], {
    icon: myIcon,
    title: "International Space Station",
}).addTo(map);


// //Add marker on click
// map.on('click', function (e) {
//     let mp = new L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
// })

//Scale
L.control.scale({
    metric: true,
    imperial: false,
    maxWidth: 150,
    position: 'topright',
    title: 'Scale',
}).addTo(map);


//!Leaflet Map Settings------------------------------------------------------------

//Retrieve data from JSON
let url = './language/gr.json'

function printAttributes(velocityData, lat, long, alt, velocity, sum, visibilityValue) {
    //Labels
    //  //TODO: add these to html doc
    // let getLangData = async function (url) {
    //     let response = await fetch(url);
    //     let data = response.json();
    //     let { latitude, longitude, altitude, approximatePos, visibility, speed } = data;
    // };

    // console.log(data)
    // let myVariable = "" + data + longitude;

    // document.getElementById('lat').textContent = myVariable;

    //Values
    document.getElementById("lat").textContent = lat.toFixed(4);
    document.getElementById("lon").textContent = long.toFixed(4);
    document.getElementById("alt").textContent = alt.toFixed(3);
    document.getElementById("vel").textContent = velocity.toFixed(3);
    document.getElementById("ave").textContent = (sum / velocityData.length).toFixed(3);
    document.getElementById("max").textContent = (Math.max(...velocityData).toFixed(3));
    document.getElementById("min").textContent = (Math.min(...velocityData).toFixed(3));

    if (lat > 1 && long < 0) {
        document.getElementById('pos').textContent = "North-Western Hemisphere"
    }
    else if (lat > 1 && long > 0) {
        document.getElementById('pos').textContent = "North-Eastern Hemisphere"
    }
    else if (lat < -1 && long < 0) {
        document.getElementById('pos').textContent = "South-Western Hemisphere"
    }
    else if (lat < -1 && long > 0) {
        document.getElementById('pos').textContent = "South-Eastern Hemisphere"
    }
    else if (lat >= -1.0 && lat <= 1.0) {
        document.getElementById('pos').textContent = "Equator"
    }

    if (visibilityValue === "daylight") {
        document.getElementById('time').className = "fa-solid fa-sun"
    }
    else {
        document.getElementById('time').className = "fa-solid fa-moon"
    }
}

const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
const velocityData = [];
let sum = 0;
//Main
async function getISS() {
    const response = await fetch(api_url);
    const data = await response.json();
    const { latitude, longitude, altitude, velocity, visibility } = data;
    sum += velocity;
    velocityData.push(velocity);
    marker.setLatLng([latitude, longitude]);
    printAttributes(velocityData, latitude, longitude, altitude, velocity, sum, visibility);
    setTimeout(getISS, 4000);
}

//Buttons
document.getElementById('btn-satellite').addEventListener('click', function () {
    L.tileLayer(
        tileUrlSat, {
        attribution: '&copy; ' + mapLink + ', ' + attributionSat,
        maxZoom: 20,
        minZoom: 1,
        noWrap: true,
    }).addTo(map);
    marker.setIcon(myIcon);
});

document.getElementById('btn-map').addEventListener('click', function () {
    L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 20,
        minZoom: 1,
        noWrap: true,
    }).addTo(map);
    marker.setIcon(myIcon2);
});

getISS();