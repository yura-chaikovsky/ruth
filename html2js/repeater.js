const esc = require("html2js-compiler").esc;


function addRepeaterNodeTypes(ast) {
    ast.forEach(node => {
        if (node.type === "element") {
            if(node.tagName === "repeat") {
                node.type = "repeater";
            }
            addRepeaterNodeTypes(node.children);
        }
    });

    return ast;
}


function repeaterGenerator(astNode, varName, parentNodeVarName, variables, level) {
    const prefix = [], suffix = [];
    const pad = " ".repeat(4 * level);
    const iteratorsNames = {};

    astNode.attributes.forEach(({key, value}) => {
        iteratorsNames[key] = value;
    });

    prefix.push(pad + `for(let ${iteratorsNames["as"]} of ${iteratorsNames["every"]}) {`);
    suffix.push(pad + `}`);

    return {prefix, suffix};
}

module.exports = {
    addRepeaterNodeTypes,
    repeaterGenerator
};