const path = require('path');
const fs = require('fs');

module.exports.getFiles = (options) => {
    var rawFiles = [];
    const data = fs.readdirSync(path.join(options.folder));
    data.forEach( e => {
        const p = path.join(`${options.folder}/`) + e;
        const result = fs.readFileSync(p, 'utf8');
        rawFiles.push({ result, p });
    })
    return rawFiles;
}