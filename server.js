const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let patches = {};

// Endpoint to plant berries
app.post('/plant', (req, res) => {
    const { id, berries } = req.body;
    if (!patches[id]) {
        patches[id] = { berries: [], plantedAt: new Date() };
    }
    berries.forEach(({ index, berry }) => {
        patches[id].berries[index] = { id: berry, plantedAt: new Date() };
    });
    res.sendStatus(200);
});

// Endpoint to get patch data
app.get('/patch/:id', (req, res) => {
    const { id } = req.params;
    res.json(patches[id] || {});
});

app.listen(3000, () => {
    console.log('Server running on port 3000: http://localhost:3000/');
});
