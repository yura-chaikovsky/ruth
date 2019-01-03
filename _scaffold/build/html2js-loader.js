const compile = require("ruth/html2js");

module.exports = function preprocess(content, map) {
    this.callback(null, compile(content), map);
};
