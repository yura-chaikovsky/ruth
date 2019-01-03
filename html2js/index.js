const compile = require("html2js-compiler").compile;
const repeater = require("./repeater");


const compilerOptions = {
    parser: {
        maps: [repeater.addRepeaterNodeTypes],
        removeEmptyNodes: true
    },
    compiler: {
        generators: {
            "repeater": repeater.repeaterGenerator
        }
    }
};

module.exports = function (content) {
    return "module.exports = () => {\n" + compile(content, compilerOptions) + "    return el_0;\n}";
};