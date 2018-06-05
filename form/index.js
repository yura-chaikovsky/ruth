export const Form = {
    serialize(form, data = {}) {
        let el;
        let value;

        const accessor = (obj, is, value, type = {}) => {
            if (typeof is == 'string') {
                return accessor(obj, is.split('.'), value, type);
            } else if (is.length == 1 && value !== undefined) {
                !obj[is[0]] && (obj[is[0]] = new type.constructor);
                if (Array.isArray(obj[is[0]])) {
                    obj[is[0]].push(value)
                } else {
                    obj[is[0]] = value
                }
                return obj[is[0]];
            } else if (is.length == 0) {
                return obj;
            } else {
                !obj[is[0]] && (obj[is[0]] = {});
                return accessor(obj[is[0]], is.slice(1), value, type);
            }
        };

        for (let i = 0; i < form.elements.length; ++i) {
            el = form.elements[i];
            if (!el.disabled && el.name !== "") {
                if (el.type === "checkbox") {
                    el.checked && accessor(data, el.name, el.value, []);
                    continue;
                } else if (el.type === "number") {
                    value = +el.value;
                } else if (el.dataset.model) {
                    value = {id: el.value, link: el.dataset.model + "/" + el.value};
                } else {
                    value = el.value;
                }

                accessor(data, el.name, value, {});
            }

        }

        return data;
    },

    updateSignals(form, signals) {
        const model = this.serialize(form);
        Object.keys(model).forEach(key => signals[key](model[key]));
    },

    uuid(a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.uuid);
    }
}