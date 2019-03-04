const esc = require("html2js-compiler").esc;


function addDirectiveNodeType(ast) {
    ast.forEach(node => {
        if (node.type === "element") {
            // if tag name starts with latin capital
            // charCode("A") == 65, charCode("Z") == 90
            if(node.name.charCodeAt(0) > 64 && node.name.charCodeAt(0) < 91) {
                node.type = "directive";
            }
            addDirectiveNodeType(node.children);
        }
    });

    return ast;
}


function directiveGenerator(astNode, varName, parentNodeVarName, variables, level) {
    const prefix = [], suffix = [];
    const pad = " ".repeat(4 * level);
    let scope = "{}";

    astNode.attributes.forEach(({key, value}) => {
        if(key === "scope") {
            scope = value;
        } else {
            prefix.push(pad + `${varName}.setAttribute("${key}", \`${esc(value)}\`);`);
        }
    });

    prefix.unshift(pad + `${varName} = this.$addChild(Ruth.directives["${astNode.tagName.toLowerCase()}"](${scope}));`);

    prefix.push(pad + `${parentNodeVarName}.appendChild(${varName})`);

    return {prefix, suffix, domNode: true};
}

module.exports = {
    addDirectiveNodeType,
    directiveGenerator
};
