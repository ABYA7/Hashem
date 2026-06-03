const fs = require('fs');
const path = require('path');
const https = require('https');

const dataDir = path.join(__dirname, 'data');

// Crear directorio data si no existe
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const bibles = [
    {
        name: 'rv1909',
        url: 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json',
        filename: 'rv1909.json'
    }
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        console.log(`Descargando ${url}...`);
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Guardado en ${dest}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {}); // Delete the file async. (But we don't check the result)
            reject(err);
        });
    });
}

async function main() {
    for (const bible of bibles) {
        const destPath = path.join(dataDir, bible.filename);
        try {
            await downloadFile(bible.url, destPath);
        } catch (error) {
            console.error(`Error descargando ${bible.name}:`, error.message);
        }
    }
    console.log("¡Descarga de biblias completada!");
}

main();
