const api_url = "https://api.wheretheiss.at/v1/satellites/25544";
const velocityData = [];
let sum = 0;
async function getISS() {
    const response = await fetch(api_url);
    const data = await response.json();
    const { latitude, longitude, altitude, velocity, visibility } = data;
    velocityData.push(velocity);
    // let sum = velocityData.reduce((prev, curr) => {
    //     return prev + curr;
    // }, 0);
    sum += velocity;

    locationISS(latitude, longitude, visibility);
    printAttributes(velocityData, latitude, longitude, altitude, velocity, sum);
    console.log(velocityData);
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
