const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // Ensure uuid is installed

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));  // Serve static files from 'public' directory

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Directory for licenses
const licensesDir = path.join(__dirname, 'licenses');

// Ensure licenses directory exists
if (!fs.existsSync(licensesDir)) {
    fs.mkdirSync(licensesDir);
}

// Route to add a new license
app.post('/add-license', (req, res) => {
    const newLicense = req.body;
    const licenseId = uuidv4();  // Generate a unique ID for the license file
    const licenseFilePath = path.join(licensesDir, `${licenseId}.json`);

    if (fs.existsSync(licenseFilePath)) {
        return res.status(400).send('An unexpected error occurred');
    }

    const licenseData = {
        ...newLicense,
        'Licensed-by': 'likeIcare2022_'
    };

    fs.writeFile(licenseFilePath, JSON.stringify(licenseData, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error creating license file');
        }

        fs.readFile('keys.json', (err, data) => {
            if (err) return res.status(500).send('Error reading keys file');
            let keys = JSON.parse(data);

            if (keys.keys.includes(newLicense.purchaseKey)) {
                keys.keys = keys.keys.filter(key => key !== newLicense.purchaseKey);

                fs.writeFile('keys.json', JSON.stringify(keys, null, 2), (err) => {
                    if (err) return res.status(500).send('Error updating keys file');

                    const licenseUrl = `https://scratch-license.onrender.com/licenses/${licenseId}`;
                    res.send(licenseUrl);
                });
            } else {
                res.status(400).send('Invalid or already used purchase key.');
            }
        });
    });
});

// Route to add a new key
app.post('/add-key', (req, res) => {
    const newKey = req.body.newKey;

    fs.readFile('keys.json', (err, data) => {
        if (err) return res.status(500).send('Error reading keys file');
        let keys = JSON.parse(data);
        keys.keys.push(newKey);

        fs.writeFile('keys.json', JSON.stringify(keys, null, 2), (err) => {
            if (err) return res.status(500).send('Error adding key');
            res.send('Key added successfully');
        });
    });
});

// Route to get all keys
app.get('/get-keys', (req, res) => {
    fs.readFile('keys.json', (err, data) => {
        if (err) return res.status(500).send('Error reading keys file');
        res.json(JSON.parse(data));
    });
});

// Route to get all licenses
app.get('/get-licenses', (req, res) => {
    fs.readdir(licensesDir, (err, files) => {
        if (err) return res.status(500).send('Error reading licenses directory');
        const licenses = files.map(file => path.parse(file).name);
        res.json({ licenses });
    });
});

// Route to get a specific license
app.get('/licenses/:id', (req, res) => {
    const licenseId = req.params.id;
    const licenseFilePath = path.join(licensesDir, `${licenseId}.json`);
    fs.readFile(licenseFilePath, (err, data) => {
        if (err) {
            return res.status(404).send('License not found');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
