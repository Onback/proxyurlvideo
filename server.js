const express = require('express');
const request = require('request');
const app = express();

// CORS Middleware: Allow all origins
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Proxy Route for Streamtape API
app.get('/streamtape-proxy', (req, res) => {
    const streamtapeUrl = req.query.url;  // Get the URL from query params

    if (!streamtapeUrl) {
        return res.status(400).send('Missing "url" query parameter');
    }

    // Send a request to the Streamtape URL
    request({
        url: streamtapeUrl,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
        }
    }, (error, response, body) => {
        if (error) {
            return res.status(500).send('Error fetching data from Streamtape');
        }

        // Forward the response back to the client
        res.send(body);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CORS Proxy Server running on port ${PORT}`);
});

