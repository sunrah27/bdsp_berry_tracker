// Initialize the map
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: 0,
    zoomControl: false, // Disable default zoom control to customize later
    maxBoundsViscosity: 1.0 // Ensure the map smoothly stays within bounds
}).setView([367, 634], 0);

// Add custom zoom control at the bottom right
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Load the map image
var bounds = [[0, 0], [734, 1268]]; // Adjust based on your map image dimensions
var image = L.imageOverlay('map.png', bounds).addTo(map);

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
var berryPatches = [
    { id: 1, name: 'Floaroma Town', description: 'On each side of the Flower Shop.', img: '1.png', coords: [285, 380], numPatches: 2 },
    { id: 2, name: 'Route 205', description: 'On the left after exiting Floroma Town.', img: '2.png', coords: [285, 405], numPatches: 2 },
    { id: 3, name: 'Route 205', description: 'Need to hop down the ledge midway up route 205 towards Eterna Forest.', img: '3.png', coords: [300, 405], numPatches: 2 },
    { id: 4, name: 'Eterna Forest', description: 'Outside the entrence of Eterna. Need HM Cut.', img: '4.png', coords: [354, 445], numPatches: 4 },
    { id: 5, name: 'Route 205', description: 'On the right after exiting Eterna Forest to the east.', img: '5.png', coords: [377, 470], numPatches: 4 },
    { id: 6, name: 'Route 206', description: 'On the left of Cycling Rod southern exit.', img: '6.png', coords: [240, 500], numPatches: 2 },
    { id: 7, name: 'Route 206', description: 'Under Cycling Road. Need HM Cut.', img: '7.png', coords: [300, 500], numPatches: 2 },
    { id: 8, name: 'Route 206', description: 'North of Oreburgh City.', img: '8.png', coords: [233, 500], numPatches: 4 },
    { id: 9, name: 'Route 208', description: 'Next to Berry Master\'s house.', img: '9.png', coords: [233, 600], numPatches: 4 },
    { id: 10, name: 'Route 208', description: 'Next to Berry Master\'s house.', img: '9.png', coords: [233, 675], numPatches: 4 },
    { id: 11, name: 'Route 208', description: 'Next to Berry Master\'s house.', img: '9.png', coords: [257, 721], numPatches: 4 },
    { id: 12, name: 'Solaceon Town', description: 'Next to shop.', img: '9.png', coords: [290, 721], numPatches: 4 },
    { id: 13, name: 'Route 208', description: 'Next to Berry Master\'s house.', img: '9.png', coords: [310, 721], numPatches: 4 },
    // Add more patches with their coordinates and numPatches
];

// Define the list of berries
var berryOptions = [
    'Cheri Berry',
    'Chesto Berry',
    'Pecha Berry',
    'Rawst Berry',
    'Asper Berry',
    'Oran Berry',
    'Razz Berry',
    'Bluk Berry',
    'Nanab Berry',
    'Pinap Berry',
    'Kebia Berry',
    'Tomato Berry',
    // Add more berries as needed
];

function createBerrySelect(patchId, index, selectedBerry) {
    let options = berryOptions.map(berry => 
        `<option value="${berry}" ${selectedBerry === berry ? 'selected' : ''}>${berry}</option>`
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

    // Send data to the server
    fetch('/plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: patchId, berries: [{ index, berry }] }),
    }).then(response => response.json())
      .then(data => {
          console.log('Berry selection saved:', data);
      })
      .catch(error => console.error('Error saving berry selection:', error));
}
  
function updateMarkerPopup(marker, patch) {
    fetch(`/patch/${patch.id}`)
        .then(response => response.json())
        .then(data => {
            let berrySelects = '';
            for (let i = 0; i < patch.numPatches; i++) {
                berrySelects += createBerrySelect(patch.id, i, data.berries && data.berries[i] ? data.berries[i] : '');
            }

            marker.bindPopup(`
                <b>${patch.name}</b>
                <p>${patch.description}</p>
                <img src="${patch.img}" alt="${patch.description}" width="320" height="180">
                <form id="form${patch.id}" class="pinPopUp">
                    ${berrySelects}
                </form>
            `);
        });
}

// Define a custom icon
var customIcon = L.icon({
    iconUrl: 'berryIcon_34x34.png', // Path to your custom icon image
    iconSize: [24, 24], // Size of the icon
    iconAnchor: [13, 24], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -24] // Point from which the popup should open relative to the iconAnchor
});

// Add markers to the map
berryPatches.forEach(function (patch) {
    var marker = L.marker(patch.coords, { icon: customIcon }).addTo(map);
    updateMarkerPopup(marker, patch);
});
