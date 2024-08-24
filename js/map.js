function initialiseMap() {
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
    const image = L.imageOverlay('img/map.png', bounds).addTo(map);

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