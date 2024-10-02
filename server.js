const express = require('express');
const request = require('request');
const app = express();

// Route to stream the video with optimized buffer handling
app.get('/proxy-download', (req, res) => {
    const videoUrl = req.query.url; // The video URL to stream

    // Check if a range is requested for video streaming
    const range = req.headers.range;
    if (range) {
        console.log('Range request:', range);

        // Make the request to the video URL with the range
        const options = {
            url: videoUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Range': range, // Pass the range header to support video streaming
            }
        };

        // Forward the video stream to the client
        request(options)
            .on('response', (response) => {
                // Set the appropriate headers for video streaming
                res.writeHead(response.statusCode, {
                    'Content-Range': response.headers['content-range'],
                    'Content-Length': response.headers['content-length'],
                    'Content-Type': response.headers['content-type'],
                    'Accept-Ranges': 'bytes'
                });
            })
            .pipe(res, { end: true })
            .on('error', (err) => {
                console.error('Error streaming video:', err);
                res.status(500).send('Error streaming video');
            });
    } else {
        console.log('Full video request (no Range header)');

        // If no range header is present, stream the entire video
        const options = {
            url: videoUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0',
            }
        };

        // Forward the entire video stream to the client
        request(options)
            .on('response', (response) => {
                // Set the appropriate headers for video download
                res.writeHead(response.statusCode, {
                    'Content-Length': response.headers['content-length'],
                    'Content-Type': response.headers['content-type'],
                    'Accept-Ranges': 'bytes'
                });
            })
            .pipe(res, { end: true })
            .on('error', (err) => {
                console.error('Error streaming full video:', err);
                res.status(500).send('Error streaming full video');
            });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
