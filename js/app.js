// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    checkGeolocation();
});

function initMap() {
    // Initialize the map centered on a default location
    map = L.map('cleanup-map').setView([34.0522, -118.2437], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function setupEventListeners() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const mapSection = document.querySelector('#map');
            mapSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function checkGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 12);
                addUserMarker(latitude, longitude);
                fetchNearbyBeaches(latitude, longitude);
            },
            error => {
                console.warn("Error getting location:", error);
            }
        );
    }
}

function addUserMarker(lat, lng) {
    const userMarker = L.marker([lat, lng], {
        title: 'Your Location'
    }).addTo(map);
    markers.push(userMarker);
}

async function fetchNearbyBeaches(lat, lng) {
    // This would typically fetch from an API
    // For now, we'll add some sample beach cleanup locations
    const sampleLocations = [
        { name: "North Beach Cleanup", lat: lat + 0.01, lng: lng + 0.01 },
        { name: "South Shore Squad", lat: lat - 0.01, lng: lng - 0.01 },
        { name: "Beach Warriors", lat: lat + 0.02, lng: lng - 0.02 }
    ];

    sampleLocations.forEach(location => {
        const marker = L.marker([location.lat, location.lng], {
            title: location.name
        })
        .bindPopup(`
            <h3>${location.name}</h3>
            <p>Join the next cleanup!</p>
            <button onclick="joinCleanup('${location.name}')">Join Squad</button>
        `)
        .addTo(map);
        markers.push(marker);
    });
}

function joinCleanup(locationName) {
    // This would typically integrate with a backend
    alert(`Thanks for joining the cleanup at ${locationName}! We'll send you the details soon.`);
}

// Weather functionality to be implemented
async function fetchWeather(lat, lng) {
    // TODO: Integrate with a weather API
}
