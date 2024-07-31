// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    zoomControl: false, // Disable default zoom control to customize later
    maxBoundsViscosity: 1.0 // Ensure the map smoothly stays within bounds
}).setView([367, 634], 0);

// Add custom zoom control at the bottom right
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Load the map image
const bounds = [[0, 0], [734, 1268]]; // Adjust based on your map image dimensions
const image = L.imageOverlay('map.png', bounds).addTo(map);

map.fitBounds(bounds);

// Set max bounds to prevent dragging beyond the image
map.setMaxBounds(bounds);

// Disable dragging if the initial zoom level is 0
if (map.getZoom() === 0) {
    map.dragging.disable();
}

// Add zoomend event listener to enable/disable dragging
map.on('zoomend', function () {
    if (map.getZoom() === 0) {
        map.dragging.disable();
    } else {
        map.dragging.enable();
    }
});

// Define berry patches with coordinates and number of patches (y, x)
const berryPatches = [
    { id: 1, name: 'Floaroma Town', description: 'On each side of the Flower Shop.', img: '1.jpg', coords: [285, 380], numPatches: 2 },
    { id: 2, name: 'Route 205', description: 'On the left after exiting Floroma Town.', img: '2.jpg', coords: [285, 405], numPatches: 2 },
    { id: 3, name: 'Route 205', description: 'Need to hop down the ledge midway up route 205 towards Eterna Forest.', img: '3.jpg', coords: [300, 405], numPatches: 2 },
    { id: 4, name: 'Eterna Forest', description: 'Outside the entrence of Eterna. Need HM Cut.', img: '4.jpg', coords: [354, 445], numPatches: 4 },
    { id: 5, name: 'Route 205', description: 'On the right after exiting Eterna Forest to the east.', img: '5.jpg', coords: [377, 470], numPatches: 4 },
    { id: 6, name: 'Route 206', description: 'On the left of Cycling Rod southern exit.', img: '6.jpg', coords: [240, 506], numPatches: 2 },
    { id: 7, name: 'Route 206', description: 'Under Cycling Road. Need HM Cut.', img: '7.jpg', coords: [300, 506], numPatches: 2 },
    { id: 8, name: 'Route 206', description: 'North of Oreburgh City.', img: '8.jpg', coords: [233, 506], numPatches: 4 },
    { id: 9, name: 'Route 208', description: 'Next to Berry Master\'s house.', img: '9.jpg', coords: [233, 600], numPatches: 4 },
    { id: 10, name: 'Route 209', description: 'Across two bridges about halfway through the route.', img: '10.jpg', coords: [233, 675], numPatches: 2 },
    { id: 11, name: 'Route 209', description: 'On the right side just before the second Cycle slide.', img: '11.jpg', coords: [257, 721], numPatches: 2 },
    { id: 12, name: 'Solaceon Town', description: 'Next to shop.', img: '12.jpg', coords: [290, 721], numPatches: 4 },
    { id: 13, name: 'Route 210', description: 'On the right, right outside Solaceon Town.', img: '13.jpg', coords: [310, 721], numPatches: 4 },
    { id: 14, name: 'Route 215', description: 'Halfway through the route, under a wooden bridge.', img: '14.jpg', coords: [325, 775], numPatches: 2 },
    { id: 15, name: 'Route 215', description: 'On the right right outside Solaceon Town.', img: '15.jpg', coords: [325, 818], numPatches: 2 },
    { id: 16, name: 'Route 214', description: 'On the right right outside Solaceon Town.', img: '16.jpg', coords: [270, 867], numPatches: 4 },
    { id: 17, name: 'Route 213', description: 'On the right right outside Solaceon Town.', img: '17.jpg', coords: [130, 815], numPatches: 4 },
    { id: 18, name: 'Pastoria City', description: 'On the right right outside Solaceon Town.', img: '18.jpg', coords: [130, 770], numPatches: 4 },
    { id: 19, name: 'Route 212', description: 'On the right right outside Solaceon Town.', img: '19.jpg', coords: [110, 750], numPatches: 4 },
    { id: 20, name: 'Route 212', description: 'On the right right outside Solaceon Town.', img: '19.jpg', coords: [185, 625], numPatches: 2 },
    { id: 21, name: 'Route 212', description: 'On the right right outside Solaceon Town.', img: '20.jpg', coords: [165, 625], numPatches: 2 },
    // Add more patches with their coordinates and numPatches
];

// Define the list of berries
const berryOptions = [
    { id: 1, name: 'Cheri Berry', growth: 12 },
    { id: 2, name: 'Chesto Berry', growth: 12 },
    { id: 3, name: 'Pecha Berry', growth: 12 },
    { id: 4, name: 'Rawst Berry', growth: 12 },
    { id: 5, name: 'Aspear Berry', growth: 12 },
    { id: 6, name: 'Leppa Berry', growth: 16 },
    { id: 7, name: 'Oran Berry', growth: 16 },
    { id: 8, name: 'Persim Berry', growth: 16 },
    { id: 9, name: 'Lum Berry', growth: 48 },
    { id: 10, name: 'Sitrus Berry', growth: 32 },
    { id: 11, name: 'Figy Berry', growth: 20 },
    { id: 12, name: 'Wiki Berry', growth: 20 },
    { id: 13, name: 'Mago Berry', growth: 20 },
    { id: 14, name: 'Aguav Berry', growth: 20 },
    { id: 15, name: 'Iapapa Berry', growth: 20 },
    { id: 16, name: 'Razz Berry', growth: 8 },
    { id: 17, name: 'Bluk Berry', growth: 8 },
    { id: 18, name: 'Nanab Berry', growth: 8 },
    { id: 19, name: 'Wepear Berry', growth: 8 },
    { id: 20, name: 'Pinap Berry', growth: 8 },
    { id: 21, name: 'Pomeg Berry', growth: 32 },
    { id: 22, name: 'Kelpsy Berry', growth: 32 },
    { id: 23, name: 'Qualot Berry', growth: 32 },
    { id: 24, name: 'Hondew Berry', growth: 32 },
    { id: 25, name: 'Grepa Berry', growth: 32 },
    { id: 26, name: 'Tamato Berry', growth: 32 },
    { id: 27, name: 'Cornn Berry', growth: 24 },
    { id: 28, name: 'Magost Berry', growth: 24 },
    { id: 29, name: 'Rabuta Berry', growth: 24 },
    { id: 30, name: 'Nomel Berry', growth: 60 },
    { id: 31, name: 'Spelon Berry', growth: 60 },
    { id: 32, name: 'Pamtre Berry', growth: 60 },
    { id: 33, name: 'Watmel Berry', growth: 60 },
    { id: 34, name: 'Durin Berry', growth: 60 },
    { id: 35, name: 'Belue Berry', growth: 60 },
    { id: 36, name: 'Occa Berry', growth: 72 },
    { id: 37, name: 'Passho Berry', growth: 72 },
    { id: 38, name: 'Wacan Berry', growth: 72 },
    { id: 39, name: 'Rindo Berry', growth: 72 },
    { id: 40, name: 'Yache Berry', growth: 72 },
    { id: 41, name: 'Chople Berry', growth: 72 },
    { id: 42, name: 'Kebia Berry', growth: 72 },
    { id: 43, name: 'Shuca Berry', growth: 72 },
    { id: 44, name: 'Coba Berry', growth: 72 },
    { id: 45, name: 'Payapa Berry', growth: 72 },
    { id: 46, name: 'Tanga Berry', growth: 72 },
    { id: 47, name: 'Charti Berry', growth: 72 },
    { id: 48, name: 'Kasib Berry', growth: 72 },
    { id: 49, name: 'Haban Berry', growth: 72 },
    { id: 50, name: 'Colbur Berry', growth: 72 },
    { id: 51, name: 'Babiri Berry', growth: 72 },
    { id: 52, name: 'Chilan Berry', growth: 72 },
    { id: 53, name: 'Liechi Berry', growth: 96 },
    { id: 54, name: 'Ganlon Berry', growth: 96 },
    { id: 55, name: 'Salac Berry', growth: 96 },
    { id: 56, name: 'Petaya Berry', growth: 96 },
    { id: 57, name: 'Apicot Berry', growth: 96 },
    { id: 58, name: 'Lansat Berry', growth: 12 },
    { id: 59, name: 'Starf Berry', growth: 96 },
    { id: 60, name: 'Enigma Berry', growth: 96 },
    { id: 61, name: 'Micle Berry', growth: 96 },
    { id: 62, name: 'Custap Berry', growth: 96 },
    { id: 63, name: 'Jaboca Berry', growth: 96 },
    { id: 64, name: 'Rowap Berry', growth: 96 },
    { id: 65, name: 'Roseli Berry', growth: 48 },
];

function createBerrySelect(patchId, index, selectedBerry) {
    let options = `<option value="" ${!selectedBerry.id ? 'selected' : ''}>Select a Berry</option>`;
    options += berryOptions.map(berry => 
        `<option value="${berry.id}" ${selectedBerry.id === berry.id ? 'selected' : ''}>${berry.name}</option>`
    ).join('');

    return `
        <div>
            <label for="berry${patchId}_${index}">Berry ${index + 1}:</label>
            <select id="berry${patchId}_${index}" name="berry${patchId}_${index}" onchange="saveBerrySelection(${patchId}, ${index})">
                ${options}
            </select>
        </div>
    `;
}

function saveBerrySelection(patchId, index) {
    let berry = document.getElementById(`berry${patchId}_${index}`).value;

    if (berry === "") {
        console.log('No berry selected');
        return;
    }

    const data = { id: patchId, berries: [{ index, berry }] };

    saveData(data)
        .then(response => {
            console.log('Berry selection saved:', response);
        })
        .catch(error => console.error('Error saving berry selection:', error));
}

function saveData(data) {
    // Save data to the server
    return fetch('/plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(response => response.text()); // Changed from response.json() to response.text() to handle non-JSON responses
}

function updateMarkerPopup(marker, patch) {
    fetch(`/patch/${patch.id}`)
        .then(response => response.json())
        .then(data => {
            let berrySelects = '';
            for (let i = 0; i < patch.numPatches; i++) {
                berrySelects += createBerrySelect(patch.id, i, data.berries && data.berries[i] ? data.berries[i] : {});
            }

            marker.bindPopup(`
                <b>${patch.name} ${patch.id}</b>
                <p>${patch.description}</p>
                <img src="${patch.img}" alt="${patch.description}" width="288" height="162">
                <form id="form${patch.id}" class="pinPopUp">
                    ${berrySelects}
                </form>
            `);
        });
}

// Define a custom icon
const customIcon = L.icon({
    iconUrl: 'berryIcon_34x34.png', // Path to your custom icon image
    iconSize: [24, 24], // Size of the icon
    iconAnchor: [13, 24], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -24] // Point from which the popup should open relative to the iconAnchor
});

// Add markers to the map
berryPatches.forEach(function (patch) {
    const marker = L.marker(patch.coords, { icon: customIcon }).addTo(map);
    updateMarkerPopup(marker, patch);
});
