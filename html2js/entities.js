const entitiesMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&deg;": "\u00B0",
    "&nbsp;": "\u00A0"
};

function replaceHtmlEntities(ast) {
    const entitiesRegExp = new RegExp(Object.keys(entitiesMap).join("|"),"g");
    const replacer = entity => entitiesMap[entity];

    ast.forEach(node => {
        if (node.type === "text") {
            node.content = node.content.replace(entitiesRegExp, replacer);
        }
        if (node.type === "element") {
            node.attributes.forEach(attr => attr.value = attr.value.replace(entitiesRegExp, replacer));
            replaceHtmlEntities(node.children);
        }
    });

    return ast;
}

module.exports = {
    replaceHtmlEntities
};