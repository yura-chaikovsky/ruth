const compile = require("html2js-compiler").compile;
const reference = require("./reference");
const entities = require("./entities");
const anchors = require("./anchors");
const repeater = require("./repeater");
const directive = require("./directive");


const compilerOptions = {
    parser: {
        maps: [
            entities.replaceHtmlEntities,
            reference.replaceDotReference,
            anchors.replaceAnchorReference,
            directive.addDirectiveNodeType,
            repeater.addRepeaterNodeType
        ],
        removeEmptyNodes: true
    },
    compiler: {
        generators: {
            "directive": directive.directiveGenerator,
            "repeater": repeater.repeaterGenerator
        }
    }
};

module.exports = function (content) {
    return "module.exports = function (Ruth) {\n" + compile(content, compilerOptions) + "\n    return el_0;\n}";
};