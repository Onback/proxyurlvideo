const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Route to proxy video content
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing target URL' });
    }

    try {
        // Forward the Range header to support partial content for video streaming
        const headers = {};
        if (req.headers.range) {
            headers['Range'] = req.headers.range;
        }

        // Fetch the video content from the actual URL
        const response = await fetch(targetUrl, { headers });

        // Set the appropriate headers from the response
        response.headers.forEach((value, name) => {
            res.setHeader(name, value);
        });

        // Forward the video content to the client
        response.body.pipe(res);
    } catch (error) {
        console.error('Error fetching video URL:', error);
        res.status(500).json({ error: 'Error fetching video URL' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`CORS proxy server is running on port ${port}`);
});
