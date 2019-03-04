export const Form = {
    serialize(form, data = {}) {
        let el;
        let value;

        const accessor = (obj, keys, value) => {

            let key = keys.shift();
            let container, pattern;

            if (Array.isArray(obj)) {
                container = {};
                obj.push(container);
            } else {
                container = obj;
            }

            if (pattern = key.match(/\[(\d*)\]$/)) {
                key = key.slice(0, pattern.index);
                (!container[key]) && (container[key] = []);
                const index = pattern[1] || container[key].length;
                if (container[key][index] === undefined) {
                    container[key][index] = {};
                }
                container = container[key];
                key = index;
            } else {
                (!container[key]) && (container[key] = {});
            }

            if (keys.length === 0) {
                if (Array.isArray(container[key])) {
                    container[key].push(value);
                } else {
                    container[key] = value;
                }
            } else {
                accessor(container[key], keys, value);
            }
        };

        const reindexArrays = (obj) => {
            if(typeof obj === "object"){
                for(const key in obj) {
                    obj[key] = reindexArrays(obj[key]);
                }
            }
            return Array.isArray(obj)? obj.filter(_ => true) : obj;
        };

        for (let i = 0; i < form.elements.length; ++i) {
            el = form.elements[i];
            if (!el.disabled && el.name !== "") {
                if (el.type === "checkbox") {
                    el.checked && accessor(data, [el.name], el.value, []);
                    continue;
                } else if (el.type === "number") {
                    value = +el.value;
                } else if (el.dataset.model) {
                    value = {id: el.value, link: el.dataset.model + "/" + el.value};
                } else {
                    value = el.value;
                }

                accessor(data, el.name.split("."), value, {});
            }
        }

        return reindexArrays(data);
    },

};