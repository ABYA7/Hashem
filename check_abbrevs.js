const fs = require('fs');
let dataStr = fs.readFileSync('data/rv1909.json', 'utf8');
if (dataStr.charCodeAt(0) === 0xFEFF) {
  dataStr = dataStr.slice(1);
}
const data = JSON.parse(dataStr);
const abbrevs = data.map(b => `${b.abbrev}: ${b.name}`);
console.log(abbrevs.join('\n'));
