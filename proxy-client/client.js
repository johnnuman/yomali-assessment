// API endpoint where the data will be sent
const apiEndpoint = 'http://localhost:8080/api/session'; // Ensure the backend service name matches docker-compose

// Define 5 different websites
const websites = [
    'http://website1.com',
    'http://website2.com',
    'http://website3.com',
    'http://website4.com',
    'http://website5.com'
];

// Define 20 different users
const users = Array.from({ length: 20 }, (_, i) => `user${i + 1}`);

// Function to generate random tracking data
function generateRandomTrackingData() {
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const operatingSystems = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
    const deviceTypes = ['Desktop', 'Mobile', 'Tablet'];

    return {
        pageUrl: `${websites[Math.floor(Math.random() * websites.length)]}/page${Math.floor(Math.random() * 10)}`,  // Random page on a random website
        referrerUrl: `http://referrer${Math.floor(Math.random() * 5 + 1)}.com`, // Random referrer
        userAgent: browsers[Math.floor(Math.random() * browsers.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        operatingSystem: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        userId: users[Math.floor(Math.random() * users.length)], // Random user
        timestamp: new Date().toISOString()
    };
}

// Function to send randomized data to the API endpoint using fetch
async function sendRandomData() {
    const trackingData = generateRandomTrackingData();

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackingData)
        });

        if (response.status === 201) {
            console.log('Data sent successfully:', trackingData);
        } else {
            console.error('Failed to send data:', response.status);
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

// Continuously send data every second
function startSendingData() {
    setInterval(async() => {
        await sendRandomData();
    }, 1000); // Sends data every 1 second
}

console.log('Starting proxy client to simulate 5 websites and 20 users...');
startSendingData();
