const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
    // Get the token from the request
    const recaptchaResponse = req.body['g-recaptcha-response'];
    
    // Verify the token
    const secretKey = '6Lc4znYqAAAAAGcjdarqLPbJCxsb80tFcBVzxZMf';
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    try {
        const response = await fetch(verifyURL, {
            method: 'POST'
        });
        
        const data = await response.json();
        console.log('Verification response:', data);
        
        if (data.success) {
            res.redirect('/result');
        } else {
            console.error('Verification failed:', data['error-codes']);
            res.status(400).send('Verification failed');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error verifying captcha');
    }
});

app.get('/result', (req, res) => {
    res.sendFile(__dirname + '/public/result.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});