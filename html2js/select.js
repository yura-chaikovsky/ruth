const esc = require("html2js-compiler").esc;


function addSelectNodeType(ast) {
    ast.forEach(node => {
        if (node.type === "element") {
            if(node.tagName === "select") {
                node.type = "select-element";
            }
            addSelectNodeType(node.children);
        }
    });

    return ast;
}


function selectElementGenerator(astNode, varName, parentNodeVarName, variables, level) {
    const prefix = [], suffix = [];
    const pad = ` `.repeat(4 * level);

    prefix.push(pad + `${varName} = document.createElement("${astNode.tagName}");`);

    for (let i in astNode.attributes) {
        if(astNode.attributes[i].key === "value") {
            suffix.push(pad + `${varName}.value = \`${esc(astNode.attributes[i].value)}\`;`);
        } else {
            prefix.push(pad + `${varName}.setAttribute("${astNode.attributes[i].key}", \`${esc(astNode.attributes[i].value)}\`);`);
        }
    }

    if (parentNodeVarName.length) {
        prefix.push(pad + `${parentNodeVarName}.appendChild(${varName});`);
    }

    return {prefix, suffix, domNode: true};
}

module.exports = {
    addSelectNodeType,
    selectElementGenerator
};
