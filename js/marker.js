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

function updateMarkerPopup(marker, patch, map) {
    // Define initial popup content with a container for multiple dropdowns
    let popupContent = `
        <b>${patch.id} ${patch.name}</b>
        <p>${patch.description}</p>
        <img src="./img/${patch.img}"><br>
        <div id="dropdown-container-${patch.id}" class="dropdown-container"></div>`;

    marker.bindPopup(popupContent, {
        autoPan: true, // Enable auto panning to keep the popup in view
        autoPanPadding: [20, 20], // Set padding around the popup (optional, adjust as needed)
        keepInView: true // Keep the popup within the map bounds
    });

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
                    updatePatchTable();
                });
            }
        } else {
            console.error(`Dropdown container with id dropdown-container-${patch.id} not found`);
        }
    });
}
