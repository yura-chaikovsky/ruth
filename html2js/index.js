const compile = require("html2js-compiler").compile;
const reference = require("./reference");
const entities = require("./entities");
const anchors = require("./anchors");
const repeater = require("./repeater");
const directive = require("./directive");
const select = require("./select");


const compilerOptions = {
    parser: {
        maps: [
            entities.replaceHtmlEntities,
            reference.replaceDotReference,
            anchors.replaceAnchorReference,
            directive.addDirectiveNodeType,
            repeater.addRepeaterNodeType,
            select.addSelectNodeType
        ],
        removeEmptyNodes: true
    },
    compiler: {
        generators: {
            "directive": directive.directiveGenerator,
            "repeater": repeater.repeaterGenerator,
            "select-element": select.selectElementGenerator
        }
    }
};

module.exports = function (content) {
    return "module.exports = function (Ruth) {\n" + compile(content, compilerOptions) + "\n    return el_0;\n}";
};
