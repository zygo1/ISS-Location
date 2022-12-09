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


//Add marker on click
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

//Language Events
let url = './language/en.json';
function validateLanguage() {
    let ddl = document.getElementById('language');
    let selectedLang = ddl.options[ddl.selectedIndex].value;
    let url = selectedLang === "en" ? './language/en.json' : './language/gr.json';
    return url;
}

let select = document.getElementById('language');
select.addEventListener('change', function () {
    url = validateLanguage();
    getISS();
});

async function printAttributes(velocityData, lat, long, alt, velocity, sum, visibilityValue) {
    //Get data
    const response = await fetch(url);
    const data = await response.json();
    let {
        locationIss, language, attributes, latitude, longitude, altitude, approximatePos,
        visibility, speed, maximumSpeed, minimumSpeed, averageSpeed, satellite, map, kmh, km, north_Western,
        north_Eastern, south_Western, south_Eastern, equator
    } = data;

    //Labels
    document.getElementById('text-header').textContent = locationIss;
    document.getElementById('lang').textContent = language + ": ";
    document.getElementById('attr').textContent = attributes;
    document.getElementById('btn-satellite').textContent = satellite;
    document.getElementById('btn-map').textContent = map;
    document.getElementById('visibility').textContent = visibility + ": ";

    //Values
    document.getElementById("lat").textContent = "" + latitude + ": " + lat.toFixed(4);
    document.getElementById("lon").textContent = "" + longitude + ": " + long.toFixed(4);
    document.getElementById("alt").textContent = "" + altitude + ": " + alt.toFixed(3);
    document.getElementById("vel").textContent = "" + speed + ": " + velocity.toFixed(3) + " " + km;
    document.getElementById("ave").textContent = "" + averageSpeed + ": " + (sum / velocityData.length).toFixed(3) + " " + kmh;
    document.getElementById("max").textContent = "" + maximumSpeed + ": " + (Math.max(...velocityData).toFixed(3)) + " " + kmh;
    document.getElementById("min").textContent = "" + minimumSpeed + ": " + (Math.min(...velocityData).toFixed(3)) + " " + kmh;

    //Approximate Position Calculation
    if (lat > 1 && long < 0) {
        document.getElementById('pos').textContent = "" + approximatePos + ": " + north_Western;
    }
    else if (lat > 1 && long > 0) {
        document.getElementById('pos').textContent = "" + approximatePos + ": " + north_Eastern;
    }
    else if (lat < -1 && long < 0) {
        document.getElementById('pos').textContent = "" + approximatePos + ": " + south_Western;
    }
    else if (lat < -1 && long > 0) {
        document.getElementById('pos').textContent = "" + approximatePos + ": " + south_Eastern;
    }
    else if (lat >= -1.0 && lat <= 1.0) {
        document.getElementById('pos').textContent = "" + approximatePos + ": " + equator;
    }

    //Visibility Icon
    visibilityValue === "daylight" ? document.getElementById('time').className = "fa-solid fa-sun" : document.getElementById('time').className = "fa-solid fa-moon";
};


//Main
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
    printAttributes(velocityData, latitude, longitude, altitude, velocity, sum, visibility);
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
setInterval(getISS, 4000);