const acorn = require("acorn");

module.exports.parse = str => {
    return acorn.Parser.parse(str, { sourceType: 'module' });
}