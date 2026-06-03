const https = require('https');

https.get('https://api.github.com/repos/thiagobodruk/bible/contents/json', { headers: { 'User-Agent': 'Node.js' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const files = JSON.parse(data);
            files.forEach(f => {
                if (f.name.includes('es_')) {
                    console.log(f.name, f.download_url);
                }
            });
        } catch(e) {
            console.error(e);
        }
    });
});
