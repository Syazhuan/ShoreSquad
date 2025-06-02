// Initialize map
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    checkGeolocation();
    setupJoinButtons();
    initializeStatistics();
});

function initMap() {
    // Initialize the map centered on Singapore
    map = L.map('cleanup-map').setView([1.3521, 103.8198], 12);
    
    // Add OpenStreetMap tiles with a more modern style
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom marker icon
    const cleanupIcon = L.divIcon({
        html: '<div class="cleanup-marker"><i class="fas fa-broom"></i></div>',
        className: 'cleanup-marker-container',
        iconSize: [40, 40]
    });

    // Add markers for Singapore cleanup locations
    addCleanupLocations(cleanupIcon);
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

function addCleanupLocations(icon) {
    const sampleLocations = [
        {
            name: "East Coast Beach Warrior",
            lat: 1.3003,
            lng: 103.9177,
            date: "June 15, 2025",
            time: "9:00 AM",
            members: 24,
            description: "Join us at East Coast Park for our biggest cleanup yet!"
        },
        {
            name: "Sentosa Coastal Heroes",
            lat: 1.2494,
            lng: 103.8303,
            date: "June 22, 2025",
            time: "8:30 AM",
            members: 18,
            description: "Help keep Sentosa's beaches pristine"
        },
        {
            name: "Punggol Point Warriors",
            lat: 1.4186,
            lng: 103.9069,
            date: "June 29, 2025",
            time: "4:00 PM",
            members: 12,
            description: "Evening cleanup with amazing sunset views"
        },
        {
            name: "Pasir Ris Beach Squad",
            lat: 1.3721,
            lng: 103.9490,
            date: "July 6, 2025",
            time: "7:30 AM",
            members: 15,
            description: "Early morning cleanup followed by breakfast"
        }
    ];

    sampleLocations.forEach(location => {
        const marker = L.marker([location.lat, location.lng], {
            title: location.name,
            icon: icon
        })
        .bindPopup(`
            <div class="popup-content">
                <h3>${location.name}</h3>
                <p class="popup-date">${location.date} at ${location.time}</p>
                <p class="popup-description">${location.description}</p>
                <p class="popup-members">${location.members} members joined</p>
                <button onclick="joinCleanup('${location.name}')" class="popup-join-btn">Join Squad</button>
            </div>
        `, {
            className: 'cleanup-popup'
        })
        .addTo(map);
        
        markers.push(marker);
    });
}

// Weather functionality to be implemented
async function fetchWeather(lat, lng) {
    // TODO: Integrate with a weather API
}
