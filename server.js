const express = require('express');
const request = require('request');
const app = express();

app.use(express.json());

app.get('/proxy-download', (req, res) => {
    const downloadUrl = req.query.url; // URL to download
    request(downloadUrl).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
