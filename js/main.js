let berryOptions = null;
let berryPatches = null;

document.addEventListener('DOMContentLoaded', function() {
    loadJSONFiles();
});

async function loadJSONFiles() {
    try {
        // Fetch data for berries and patches
        const [res1, res2] = await Promise.all([
            fetch(`./data/berry.json`),
            fetch(`./data/patches.json`)
        ]);

        berryOptions = await res1.json();
        berryPatches = await res2.json();

        initialiseMap();
        updatePatchTable();
    } catch (e) {
        console.error("Error loading JSON files", e);
    }
}