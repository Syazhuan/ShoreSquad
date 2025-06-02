// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    setupJoinButtons();
    initializeStatistics();
});

function initMap() {
    // Initialize the map centered on Pasir Ris (next cleanup location)
    const pasirRisLat = 1.381497;
    const pasirRisLng = 103.955574;
    
    map = L.map('cleanup-map').setView([pasirRisLat, pasirRisLng], 13);
    
    // Add OpenStreetMap tiles with a more modern style
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add cleanup locations
    addCleanupLocations();
    
    // Update weather for Pasir Ris location
    fetchWeather(pasirRisLat, pasirRisLng);
}

function addCleanupLocations() {
    const locations = [
        {
            name: "Pasir Ris Beach Squad",
            lat: 1.381497,
            lng: 103.955574,
            date: "July 6, 2025",
            time: "7:30 AM - 10:30 AM",
            members: 15,
            description: "Next Cleanup Event! Early morning cleanup followed by breakfast",
            isNext: true
        },
        {
            name: "East Coast Beach Warrior",
            lat: 1.3003,
            lng: 103.9177,
            date: "June 15, 2025",
            time: "9:00 AM - 12:00 PM",
            members: 24,
            description: "Join us at East Coast Park for our biggest cleanup yet!"
        },
        {
            name: "Sentosa Coastal Heroes",
            lat: 1.2494,
            lng: 103.8303,
            date: "June 22, 2025",
            time: "8:30 AM - 11:30 AM",
            members: 18,
            description: "Help keep Sentosa's beaches pristine"
        },
        {
            name: "Punggol Point Warriors",
            lat: 1.4186,
            lng: 103.9069,
            date: "June 29, 2025",
            time: "4:00 PM - 6:00 PM",
            members: 12,
            description: "Evening cleanup with amazing sunset views"
        }
    ];

    locations.forEach(location => {
        const icon = location.isNext ? 
            L.divIcon({
                className: 'cleanup-marker next-cleanup-marker',
                html: '<i class="fas fa-star"></i>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            }) :
            L.divIcon({
                className: 'cleanup-marker',
                html: '<i class="fas fa-map-marker-alt"></i>',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

        const marker = L.marker([location.lat, location.lng], {
            title: location.name,
            icon: icon
        })
        .bindPopup(`
            <div class="popup-content ${location.isNext ? 'next-cleanup-popup' : ''}">
                ${location.isNext ? '<h3>⭐ Next Cleanup Event ⭐</h3>' : ''}
                <h4>${location.name}</h4>
                <p><i class="far fa-calendar-alt"></i> ${location.date}</p>
                <p><i class="far fa-clock"></i> ${location.time}</p>
                <p><i class="fas fa-user-friends"></i> ${location.members} members joined</p>
                <p>${location.description}</p>
                <button onclick="joinCleanup('${location.name}')" class="popup-join-btn">Join Squad</button>
            </div>
        `, {
            className: location.isNext ? 'next-cleanup-popup-container' : 'cleanup-popup'
        });

        // Auto-open the next cleanup popup
        if (location.isNext) {
            marker.addTo(map).openPopup();
        } else {
            marker.addTo(map);
        }
        
        markers.push(marker);
    });
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
                fetchWeather(latitude, longitude);
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

async function fetchNearbyBeaches(lat, lng) {    // This would typically fetch from an API
    // Singapore beach cleanup locations
    const sampleLocations = [
        { name: "East Coast Beach Warrior", lat: 1.3003, lng: 103.9177, date: "June 15, 2025", time: "9:00 AM", members: 24 },
        { name: "Sentosa Coastal Heroes", lat: 1.2494, lng: 103.8303, date: "June 22, 2025", time: "8:30 AM", members: 18 },
        { name: "Punggol Point Warriors", lat: 1.4186, lng: 103.9069, date: "June 29, 2025", time: "4:00 PM", members: 12 },
        { name: "Pasir Ris Beach Squad", lat: 1.3721, lng: 103.9490, date: "July 6, 2025", time: "7:30 AM", members: 15 }
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

function setupJoinButtons() {
    const joinButtons = document.querySelectorAll('.join-squad-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.cleanup-card');
            const title = card.querySelector('h3').textContent;
            const date = card.querySelector('.cleanup-date').textContent;
            const location = card.querySelector('.cleanup-location').textContent;
            
            // Update the member count
            const membersElement = card.querySelector('.members-count');
            let currentMembers = parseInt(membersElement.textContent);
            membersElement.textContent = `${currentMembers + 1} members joined`;
            
            // Update total squad members stat
            const squadStats = document.getElementById('squad-members');
            if (squadStats) {
                const currentTotal = parseInt(squadStats.textContent);
                squadStats.textContent = currentTotal + 1;
            }
            
            // Disable the button and change its text
            this.disabled = true;
            this.textContent = 'Joined!';
            this.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-eco');
            
            // Show confirmation message
            alert(`You've joined the cleanup at ${location} on ${date}! We'll send you more details soon.`);
        });
    });
}

function initializeStatistics() {
    // Initialize statistics with animations
    const options = {
        duration: 2.5,
        useEasing: true,
        useGrouping: true,
    };

    // Animate statistics when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statBox = entry.target;
                const number = statBox.querySelector('.stat-number');
                const targetValue = parseInt(number.textContent);
                const countUp = new CountUp(number, targetValue, options);
                number.textContent = '0';
                countUp.start();
                observer.unobserve(statBox);
            }
        });
    }, { threshold: 0.5 });

    // Observe all stat boxes
    document.querySelectorAll('.stat-box').forEach(box => observer.observe(box));
}

async function fetchWeather(lat, lng) {
    const currentWeather = document.getElementById('current-weather');
    const forecastGrid = document.querySelector('.forecast-grid');
    
    if (!currentWeather || !forecastGrid) return;

    // Show loading state
    currentWeather.innerHTML = '<div class="weather-loading">Loading weather data...</div>';
    forecastGrid.innerHTML = '';

    try {
        // Fetch current weather from data.gov.sg
        const currentDate = new Date().toISOString().split('T')[0];
        const currentResponse = await fetch(`https://api.data.gov.sg/v1/environment/air-temperature?date=${currentDate}`);
        const currentData = await currentResponse.json();
        
        // Fetch 4-day forecast from data.gov.sg
        const forecastResponse = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
        const forecastData = await forecastResponse.json();

        // Get current temperature (using East Coast area station if available)
        const latestReading = currentData.items[currentData.items.length - 1];
        const temperature = latestReading.readings.find(r => r.station_id === 'S24')?.value || 
                          latestReading.readings[0]?.value || 29;

        // Display current weather
        currentWeather.innerHTML = `
            <h3>Current Weather at ${new Date().toLocaleTimeString()}</h3>
            <div class="weather-details">
                <p><i class="fas fa-thermometer-half"></i> ${temperature.toFixed(1)}°C</p>
                <p><i class="fas fa-cloud"></i> ${forecastData.items[0].forecasts[0].forecast}</p>
            </div>
        `;

        // Display 4-day forecast
        const forecasts = forecastData.items[0].forecasts;
        forecastGrid.innerHTML = forecasts.map(forecast => {
            const date = new Date(forecast.date);
            const formattedDate = date.toLocaleDateString('en-SG', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Choose weather icon based on forecast
            const weatherIcon = getWeatherIcon(forecast.forecast.toLowerCase());

            return `
                <div class="forecast-card">
                    <div class="forecast-date">${formattedDate}</div>
                    <div class="forecast-icon">
                        <i class="${weatherIcon}"></i>
                    </div>
                    <div class="forecast-temp">
                        ${forecast.temperature.low}°C - ${forecast.temperature.high}°C
                    </div>
                    <div class="forecast-details">
                        <p>${forecast.forecast}</p>
                        <p><i class="fas fa-tint"></i> Relative Humidity: ${forecast.relative_humidity.low}% - ${forecast.relative_humidity.high}%</p>
                        <p><i class="fas fa-wind"></i> Wind: ${forecast.wind.speed.low} - ${forecast.wind.speed.high} km/h</p>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching weather:', error);
        currentWeather.innerHTML = '<div class="weather-error">Unable to load weather data</div>';
    }
}

function getWeatherIcon(forecast) {
    if (forecast.includes('thundery') || forecast.includes('thunder')) {
        return 'fas fa-bolt';
    } else if (forecast.includes('rain') || forecast.includes('showers')) {
        return 'fas fa-cloud-rain';
    } else if (forecast.includes('cloudy')) {
        return 'fas fa-cloud';
    } else if (forecast.includes('fair') || forecast.includes('sunny')) {
        return 'fas fa-sun';
    } else {
        return 'fas fa-cloud-sun';
    }
}
