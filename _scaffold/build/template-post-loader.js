"use strict";


module.exports = function preprocess(content, map) {
    content = "export default function (self, Ruth)" + content.slice(12, -3);

    this.callback(null, content, map);
};
