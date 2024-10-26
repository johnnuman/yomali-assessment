(function() {
  const sessionData = {
    userId: '1234',
    pageId: window.location.pathname,
    deviceType: navigator.userAgent,
    startTime: new Date().toISOString()
  };

  fetch('http://localhost:3000/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  }).catch(error => console.error('Error tracking session:', error));
})();
