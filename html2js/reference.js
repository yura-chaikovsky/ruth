
function replaceDotReference(ast) {
    const dotRegExp = /::(\w+)|(\${>)/g;
    const replacer = (match, varName, global) => global? `\${Ruth.` : `this.${varName}`;
    ast.forEach(node => {
        if (node.type === "text") {
            node.content = node.content.replace(dotRegExp, replacer);
        }
        if (node.type === "element") {
            node.attributes.forEach(attr => attr.value = attr.value.replace(dotRegExp, replacer));
            replaceDotReference(node.children);
        }
    });

    return ast;
}

module.exports = {
    replaceDotReference
};