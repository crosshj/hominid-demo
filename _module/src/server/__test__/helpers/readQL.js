const { readFileSync } = require('fs');
const readQL = (path) => readFileSync(path, 'utf8');

module.exports = readQL;
