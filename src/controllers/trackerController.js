const fs = require('fs');
const path = require('path');

exports.serve = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '..', 'tracker', 'tracker.js'); // Path to the JS tracker file
        console.log('tracker needed.');
        // Set appropriate headers to ensure efficient caching and correct content type
        res.setHeader('Content-Type', 'application/javascript');

        // Cache for 1 year for better performance. But need to be mindful about any future changes to the tracker code.
        res.setHeader('Cache-Control', 'public, max-age=31536000');

        // I have set appropriate access control headers to handle potential CORS issues.
        res.setHeader('Access-Control-Allow-Origin', '*');


        // Read and send the JS file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error loading tracker script');
            }
            res.send(data);
        });
    } catch (error) {
        next(error);
    }
};

// Serve the tracker-demo.html page
exports.serveDemoPage = (req, res) => {
    const filePath = path.join(__dirname, '..', 'tracker', 'demo.html'); // Path to the HTML demo file

    // Read and send the HTML file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading demo page');
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
    });
};