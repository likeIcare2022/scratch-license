// Get modal elements
const licenseModal = document.getElementById('licenseModal');
const adminPanel = document.getElementById('adminPanel');
const keysModal = document.getElementById('keysModal');
const licensesModal = document.getElementById('licensesModal');

// Get button elements
const licenseButton = document.getElementById('licenseButton');
const adminButton = document.getElementById('adminButton');
const viewKeysButton = document.getElementById('viewKeysButton');
const viewLicensesButton = document.getElementById('viewLicensesButton');
const addKeyButton = document.getElementById('addKeyButton');

// Get close elements
const closeLicenseModal = document.getElementById('closeLicenseModal');
const closeAdminModal = document.getElementById('closeAdminModal');
const closeKeysModal = document.getElementById('closeKeysModal');
const closeLicensesModal = document.getElementById('closeLicensesModal');

// Event listeners for buttons
if (licenseButton) {
    licenseButton.addEventListener('click', () => {
        if (licenseModal) licenseModal.style.display = 'block';
    });
}

if (adminButton) {
    adminButton.addEventListener('click', () => {
        if (adminPanel) adminPanel.style.display = 'block'; // Show the admin panel
    });
}

if (viewKeysButton) {
    viewKeysButton.addEventListener('click', () => {
        fetch('/get-keys')
            .then(response => response.json())
            .then(data => {
                const keysList = document.getElementById('keysList');
                if (keysList) {
                    keysList.innerHTML = data.keys.map(key => `<li>${key}</li>`).join('');
                    if (keysModal) keysModal.style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching keys:', error));
    });
}

if (viewLicensesButton) {
    viewLicensesButton.addEventListener('click', () => {
        fetch('/get-licenses')
            .then(response => response.json())
            .then(data => {
                const licensesList = document.getElementById('licensesList');
                if (licensesList) {
                    licensesList.innerHTML = data.licenses.map(license => `<li><a href="/licenses/${license}">${license}</a></li>`).join('');
                    if (licensesModal) licensesModal.style.display = 'block';
                }
            })
            .catch(error => console.error('Error fetching licenses:', error));
    });
}

// Event listeners for close spans
if (closeLicenseModal) {
    closeLicenseModal.addEventListener('click', () => {
        if (licenseModal) licenseModal.style.display = 'none';
    });
}

if (closeAdminModal) {
    closeAdminModal.addEventListener('click', () => {
        if (adminPanel) adminPanel.style.display = 'none';
    });
}

if (closeKeysModal) {
    closeKeysModal.addEventListener('click', () => {
        if (keysModal) keysModal.style.display = 'none';
    });
}

if (closeLicensesModal) {
    closeLicensesModal.addEventListener('click', () => {
        if (licensesModal) licensesModal.style.display = 'none';
    });
}

// Close modals when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === licenseModal) {
        if (licenseModal) licenseModal.style.display = 'none';
    }
    if (event.target === adminPanel) {
        if (adminPanel) adminPanel.style.display = 'none';
    }
    if (event.target === keysModal) {
        if (keysModal) keysModal.style.display = 'none';
    }
    if (event.target === licensesModal) {
        if (licensesModal) licensesModal.style.display = 'none';
    }
});

// License Form Submission
const licenseForm = document.getElementById('licenseForm');
if (licenseForm) {
    licenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const projectLink = document.getElementById('projectLink').value;
        const remixing = document.getElementById('remixing').value;
        const username = document.getElementById('username').value;
        const purchaseKey = document.getElementById('purchaseKey').value;

        const data = {
            title,
            projectLink,
            remixing,
            username,
            purchaseKey
        };

        fetch('keys.json')
            .then(response => response.json())
            .then(keysData => {
                if (keysData.keys.includes(purchaseKey)) {
                    fetch('/add-license', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.text())
                    .then(message => {
                        const linkDiv = document.getElementById('license-link');
                        if (linkDiv) {
                            linkDiv.innerHTML = `Put this in the credits of your project: <a href="${message}" target="_blank">${message}</a>`;
                        }
                    })
                    .catch(error => console.error('Error:', error));
                } else {
                    alert('Invalid purchase key.');
                }
            });
    });
}

// Admin Form Submission
const adminForm = document.getElementById('adminForm');
if (adminForm) {
    adminForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const password = document.getElementById('adminPassword').value;
        if (password === 'admin') {
            const adminControls = document.getElementById('adminControls');
            if (adminControls) {
                adminControls.style.display = 'block'; // Show admin controls
                alert('Admin controls are now visible.'); // Provide feedback
            }
        } else {
            alert('Invalid password.');
        }
    });
}

// Add Key Button
if (addKeyButton) {
    addKeyButton.addEventListener('click', function() {
        const newKey = document.getElementById('newKey').value;

        fetch('/add-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newKey })
        })
        .then(response => response.text())
        .then(message => alert(message))
        .catch(error => console.error('Error:', error));
    });
}
