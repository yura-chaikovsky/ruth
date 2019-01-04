
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
    const iteratorsNames = {};

    astNode.attributes.forEach(({key, value}) => {
        iteratorsNames[key] = value;
    });

    prefix.push(pad + `for(let ${iteratorsNames["as"]} of ${iteratorsNames["every"]}) {`);
    suffix.push(pad + `}`);

    return {prefix, suffix, domNode: false};
}

module.exports = {
    addRepeaterNodeType,
    repeaterGenerator
};