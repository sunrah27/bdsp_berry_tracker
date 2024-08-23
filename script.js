let berryOptions = null;
let berryPatches = null;

document.addEventListener('DOMContentLoaded', function() {
    loadJSONFiles();
});

async function loadJSONFiles() {
    try {
        // Fetch data for berry and patches
        const [res1, res2] = await Promise.all([
            fetch(`./data/berry.json`),
            fetch(`./data/patches.json`)
        ]);
        
        berryOptions = await res1.json();
        berryPatches  = await res2.json();

        initiliseMap();
    } catch (e) {
        console.error("Error loading JSON files", e);
    }
}

function initiliseMap() {
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 0,
        zoomControl: false, // Disable default zoom control to customise later
        maxBoundsViscosity: 1.0 // Ensure the map smoothly stays within bounds
    }).setView([367, 634], 0);

    // Add custom zoom control at the bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Load the map image
    const bounds = [[0, 0], [734, 1268]]; // Adjust based on your map image dimensions
    const image = L.imageOverlay('./img/map.png', bounds).addTo(map);

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

    // Add markers to the map
    berryPatches.forEach(function (patch) {
        addMarker(map, patch);
    });
}

function addMarker(map, patch) {
    // Determine the icon based on the patch state
    const { iconUrl, iconClass } = getPatchIcon(patch);

    const customIcon = L.divIcon({
        html: `<img src="${iconUrl}" class="${iconClass}">`,
        iconSize: [24, 24], // Size of the icon
        iconAnchor: [12, 24], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -24] // Point from which the popup should open relative to the iconAnchor
    });

    const marker = L.marker(patch.coords, { icon: customIcon }).addTo(map);
    updateMarkerPopup(marker, patch, map);
}

function updateMarkerIcon(marker, patch) {
    // Get the updated icon based on the patch state
    const { iconUrl, iconClass } = getPatchIcon(patch);

    // Update the marker icon
    const updatedIcon = L.divIcon({
        html: `<img src="${iconUrl}" class="${iconClass}">`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });

    marker.setIcon(updatedIcon);
}

function getPatchIcon(patch) {
    let isEmpty = true;
    let isReadyToHarvest = false;
    
    for (let i = 0; i < patch.numPatches; i++) {
        const savedData = localStorage.getItem(`${patch.id}-${(i + 1)}`);
        
        if (savedData) {
            const data = JSON.parse(savedData);
            isEmpty = false;
            const growthTime = berryOptions.find(berry => berry.id === data.value)?.growth || 0;
            const readyTime = data.timestamp + (growthTime * 60 * 60 * 1000); // Convert hours to milliseconds

            if (Date.now() > readyTime) {
                isReadyToHarvest = true;
            }
        }
    }

    if (isEmpty) {
        return { iconUrl: './img/berry_empty_128x128.png', iconClass: '' };
    } else if (isReadyToHarvest) {
        return { iconUrl: './img/berry_harvest_128x128.png', iconClass: 'shake' };
    } else {
        return { iconUrl: './img/berry_planted_128x128.png', iconClass: '' };
    }
}

// Update the marker popup with the list of berries
function updateMarkerPopup(marker, patch, map) {
    // Define initial popup content with a container for multiple dropdowns
    let popupContent = `
        <b>${patch.id} ${patch.name}</b>
        <p>${patch.description}</p>
        <img src="./img/${patch.img}"><br>
        <div id="dropdown-container-${patch.id}" class="dropdown-container"></div>`;

    marker.bindPopup(popupContent);

    // Populate the dropdowns after binding the popup
    marker.on('popupopen', function() {
        const container = document.getElementById(`dropdown-container-${patch.id}`);

        if (container) {
            // Create and populate dropdowns based on numPatches
            for (let i = 0; i < patch.numPatches; i++) {
                const dropdown = document.createElement('select');
                dropdown.id = `${patch.id}-${(i + 1)}`; // Unique ID for each dropdown/berry patch

                // Populate dropdown with berry options
                berryOptions.forEach(berry => {
                    const option = document.createElement('option');
                    option.text = berry.name;
                    option.value = berry.id;
                    dropdown.add(option);
                });

                container.appendChild(dropdown);

                // Load and set saved value and timestamp for dropdown
                const savedData = localStorage.getItem(`${patch.id}-${(i + 1)}`);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    dropdown.value = data.value || "0"; // Set to "None" if no value is saved
                } else {
                    dropdown.value = "0"; // Ensure "None" is selected by default
                }

                // Add event listener to each dropdown
                dropdown.addEventListener('change', function(e) {
                    const selectedBerryId = parseInt(e.target.value);
                    const selectedBerry = berryOptions.find(b => b.id === selectedBerryId);

                    const timestamp = Date.now();
                    const formattedTime = new Date(timestamp).toLocaleString();

                    // Save the selected value and timestamp to localStorage as a single JSON object
                    const data = {
                        value: selectedBerryId,
                        timestamp: timestamp
                    };

                    if (selectedBerryId !== 0) {
                        localStorage.setItem(`${patch.id}-${(i + 1)}`, JSON.stringify(data));
                    } else {
                        localStorage.removeItem(`${patch.id}-${(i + 1)}`);
                    }

                    // Update the marker icon immediately after planting or removing a berry
                    updateMarkerIcon(marker, patch);
                });
            }
        } else {
            console.error(`Dropdown container with id dropdown-container-${patch.id} not found`);
        }
    });
}