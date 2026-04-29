const fs = require('fs');
const https = require('https');

// Read API key from .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyLine = envFile.split('\n').find(line => line.startsWith('GEMINI_API_KEY='));
const apiKey = apiKeyLine ? apiKeyLine.split('=')[1].trim() : null;

if (!apiKey) {
    console.log("No API key found.");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const models = JSON.parse(data).models;
        if (models) {
            console.log("Available models:");
            models.forEach(m => console.log(m.name.replace('models/', '')));
        } else {
            console.log("Error fetching models:", data);
        }
    });
}).on('error', err => console.log("Error:", err.message));
