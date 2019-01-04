
function replaceAnchorReference(ast) {
    ast.forEach(node => {
        if (node.type === "element") {
            if(node.tagName === "a") {
                node.attributes.some(attr => {
                    console.log(node.tagName, attr);
                    if (attr.key === "href") {
                        if (attr.value[0] === "~") {
                            attr.value = attr.value.substr(1);
                            node.attributes.push({key: "onclick", value: "ruthNavigate(event)"});
                        }
                        return true;
                    }
                });
            }
            replaceAnchorReference(node.children);
        }
    });

    return ast;
}

module.exports = {
    replaceAnchorReference
};