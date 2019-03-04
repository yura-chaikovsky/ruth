
function addRepeaterNodeType(ast) {
    ast.forEach(node => {
        if (node.type === "element") {
            if(node.tagName === "repeat") {
                node.type = "repeater";
            }
            addRepeaterNodeType(node.children);
        }
    });

    return ast;
}


function repeaterGenerator(astNode, varName, parentNodeVarName, variables, level) {
    const prefix = [], suffix = [];
    const pad = " ".repeat(4 * level);
    const iteratorsNames = {"by": "index"};

    astNode.attributes.forEach(({key, value}) => {
        iteratorsNames[key] = value;
    });

    prefix.push(pad + `for(const [${iteratorsNames["by"]}, ${iteratorsNames["as"]}] of ${iteratorsNames["every"]}.entries()) {`);
    suffix.push(pad + `}`);

    return {prefix, suffix, domNode: false};
}

module.exports = {
    addRepeaterNodeType,
    repeaterGenerator
};