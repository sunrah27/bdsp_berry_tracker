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