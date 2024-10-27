// Currently this file is highly structured and detailed. In production, I will have it minified for optimized size
// and faster delivery. This is deliberately kept verbose for assessment purposes.

// API endpoint for sending tracking data
// For assessment, I have kept it simple to local host. In production, it will likely point to an API gateway
const trackingApiUrl = 'http://localhost:8080/api/session';

// This will keep the visitor informed about the status of the tracker during execution. This section is only for this
// assessment purposes. A live tracker will be lean and will not have any such extra code.
const updateTrackerStatus = (status) => {
  const statusElement = document.getElementById('tracker-status');
  if (statusElement) {
    statusElement.innerHTML = `Tracker status: ${status}`;
  }
};
// Function to update the HTML page with the tracked data being collected
const updateTrackedData = (data) => {
  const dataElement = document.getElementById('tracked-data');
  if (dataElement) {
    dataElement.innerHTML = JSON.stringify(data, null, 2); // Pretty-print the data in JSON format
  }
};

// Collect necessary data for tracking
// I will get the IP address on the server-side instead of relying on the client-side to avoid spoofing attempts
const trackingData = {
  pageUrl: window.location.href,
  referrerUrl: document.referrer || '',
  userAgent: navigator.userAgent,
  browser: detectBrowser(),
  operatingSystem: detectOperatingSystem(),
  deviceType: detectDeviceType(),
  timestamp: new Date().toISOString()
};
// Immediately show the collected data on the page for the assessment purpose only
updateTrackedData(trackingData);

// Function to detect the browser type
function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  if (userAgent.includes('Trident')) return 'Internet Explorer';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  return 'Unknown';
}

// Function to detect the operating system
function detectOperatingSystem() {
  const platform = navigator.platform;
  if (platform.includes('Win')) return 'Windows';
  if (platform.includes('Mac')) return 'macOS';
  if (platform.includes('Linux')) return 'Linux';
  if (/iPhone|iPad|iPod/.test(platform)) return 'iOS';
  if (/Android/.test(navigator.userAgent)) return 'Android';
  return 'Unknown';
}

// Function to detect the device type (mobile, tablet, or desktop)
function detectDeviceType() {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) return 'Mobile';
  if (/Tablet|iPad/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

// Function to send tracking data asynchronously and retry if the server does not respond with 201 status
function sendTrackingData(data) {
  updateTrackerStatus('Attempting to send data to the server...'); // Informing visitor of action

  fetch(trackingApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
      .then(response => {
        if (response.status === 201) {
          updateTrackerStatus('Tracking data sent successfully!'); // Success
          console.log('Tracking data sent successfully');
        } else {
          throw new Error('Failed to get 201 status');
        }
      })
      .catch(error => {
        console.error('Error sending tracking data:', error);
        updateTrackerStatus( 'Retrying to send tracking data...'); // Update status before retry
        // Retry after 5 seconds if it fails (non-blocking, transparent to user)
        setTimeout(() => {
          sendTrackingData(data);
        }, 5000);
      });
}

// Immediately send tracking data once the script is loaded
sendTrackingData(trackingData);

// This is only for this assessment purposes. Keeping visitor updated on background actions
updateTrackerStatus('Tracker initialized and collecting data...');
