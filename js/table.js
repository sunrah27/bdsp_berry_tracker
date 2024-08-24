function updatePatchTable() {
    const listWrapper = document.getElementById('list-wrapper');
    if (!listWrapper) {
        console.error('Element with id "list-wrapper" not found');
        return;
    }

    // Clear existing content
    listWrapper.innerHTML = '';

    // Create the container for the table
    const container = document.createElement('div');
    container.classList.add('grid-container');

    // Group patches and create rows
    berryPatches.forEach(patch => {
        // Add the patch name as a header row
        const headerRow = document.createElement('div');
        headerRow.classList.add('grid-row');

        const patchNameCell = document.createElement('div');
        patchNameCell.classList.add('grid-item', 'header');
        patchNameCell.id = patch.id;
        patchNameCell.style.gridColumn = `span ${patch.numPatches}`; // Span across all columns
        patchNameCell.innerText = patch.name;

        headerRow.appendChild(patchNameCell);
        container.appendChild(headerRow);

        // Add berry names row
        const berryNamesRow = document.createElement('div');
        const img = document.createElement('img');
        berryNamesRow.classList.add('grid-row');

        for (let i = 0; i < patch.numPatches; i++) {
            const berryCell = document.createElement('div');
            berryCell.classList.add('grid-item');
            const savedData = localStorage.getItem(`${patch.id}-${(i + 1)}`);

            if (savedData) {
                const data = JSON.parse(savedData);
                const berry = berryOptions.find(b => b.id === data.value);

                // Display berry name or "Empty"
                img.src = berry ? `./img/${data.value}.png`: ``;
                berryCell.appendChild(img);
                berryCell.innerHTML += berry ? berry.name : '----';
            } else {
                // If no data, mark as Empty
                berryCell.innerHTML = '----';
            }
            berryNamesRow.appendChild(berryCell);
        }
        container.appendChild(berryNamesRow);

        // Add harvest times row
        const harvestTimesRow = document.createElement('div');
        harvestTimesRow.classList.add('grid-row');

        for (let i = 0; i < patch.numPatches; i++) {
            const berryCell = document.createElement('div');
            berryCell.classList.add('grid-item');
            const savedData = localStorage.getItem(`${patch.id}-${(i + 1)}`);

            if (savedData) {
                const data = JSON.parse(savedData);
                const berry = berryOptions.find(b => b.id === data.value);
                
                
                // Calculate harvest time if applicable
                const growthTime = berry ? berry.growth : 0;
                const harvestTime = data.timestamp + (growthTime * 60 * 60 * 1000);
                
                // Determine if it's time to harvest
                const isReadyToHarvest = Date.now() > harvestTime;
                const harvestReady = isReadyToHarvest ? 'Harvest' : harvestTime;
                
                // Format the harvest time if it's not "Harvest"
                const formattedTime = isReadyToHarvest
                    ? 'Harvest'
                    : new Date(harvestReady).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                
                // Display harvest time
                berryCell.innerHTML = `${formattedTime}`;
            } else {
                // If no data, mark as empty
                berryCell.innerHTML = '--:--';
            }

            harvestTimesRow.appendChild(berryCell);
        }
        container.appendChild(harvestTimesRow);
    });

    listWrapper.appendChild(container);
}