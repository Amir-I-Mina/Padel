
// Club locations with coordinates
const clubLocations = {
    "Smash Club": { lat: 30.11940, lng: 31.40226 },
    "Cairo International Stadium": { lat: 30.06922, lng: 31.31224 },
    "HPark": { lat: 30.07546, lng: 31.31412 },
    "Wadi Degla": { lat: 30.09284, lng: 31.38422 },
    "Shams Club": { lat: 30.11790, lng: 31.1903 }
};

let map = null;

window.addEventListener("load", function() {
    const locationSelect = document.getElementById("location");
    const locationBtn = document.getElementById("locationBtn");
    const mapModal = document.getElementById("mapModal");

    // Enable button when location is selected
    locationSelect.addEventListener("change", () => {
        if (locationSelect.value && locationSelect.value !== "Choose location") {
            locationBtn.disabled = false;
        } else {
            locationBtn.disabled = true;
        }
    });

    // Show map when button is clicked
    locationBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showMapModal();
    });

    // Close modal when clicking outside
    mapModal.addEventListener("click", (e) => {
        if (e.target === mapModal) {
            closeMapModal();
        }
    });
});

function showMapModal() {
    const locationSelect = document.getElementById("location");
    const selectedClub = locationSelect.value;
    const coords = clubLocations[selectedClub];
    const mapModal = document.getElementById("mapModal");

    if (!coords) return;

    // Show modal
    mapModal.classList.add("active");

    // Update title
    document.getElementById("mapTitle").textContent = selectedClub;

    // Initialize map
    setTimeout(() => {
        if (!map) {
            map = L.map('locationMap').setView([coords.lat, coords.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        } else {
            map.setView([coords.lat, coords.lng], 15);
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        }

        // Add marker
        L.marker([coords.lat, coords.lng])
            .addTo(map)
            .bindPopup(`<b>${selectedClub}</b>`)
            .openPopup();
    }, 10);
}

function closeMapModal() {
    const mapModal = document.getElementById("mapModal");
    mapModal.classList.remove("active");
}



