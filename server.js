const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Add fetch for server-side requests
const fetch = require('node-fetch');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
    // Get the token from the request
    const token = req.body['cf-turnstile-response'];
    
    // Verify the token
    const formData = new URLSearchParams();
    formData.append('secret', '0x4AAAAAAAzWli0vD4SjRqJ84inAuYdZiC8');
    formData.append('response', token);

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Token is valid, process form
            res.redirect('/result');
        } else {
            // Token is invalid
            res.status(400).send('Verification failed');
        }
    } catch (error) {
        res.status(500).send('Error verifying captcha');
    }
});

app.get('/result', (req, res) => {
    res.sendFile(__dirname + '/public/result.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});