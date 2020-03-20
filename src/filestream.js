const path = require('path');
const fs = require('fs');

module.exports.getFiles = (folder, fileExtension) => {
    folder = folder || __dirname;
    fileExtension = fileExtension || '';
    files = [];

    ((inPath, callback) => {
        fs.readdirSync(inPath).forEach((name) => {
            var filePath = path.join(inPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath);
            } else if (stat.isDirectory()) {
                readFiles(filePath, callback);
            }
        });
    })(folder, (filePath) => {
        if (filePath.includes(('.' + fileExtension))) {
            const src = fs.readFileSync(filePath, 'utf8');
            files.push({ src, filePath });
        }   
    });

    return files;
}