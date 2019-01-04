export class i18n {
    static set(dictionary, locale) {
        return function i18n() {
            return function (key, ...params) {
                if (typeof dictionary[locale][key] === "undefined") {
                    throw new Error(`Internationalization for key '${key}' not found in language '${locale}'.`);
                }

                return typeof dictionary[locale][key] === "string" ?
                    dictionary[locale][key]
                    : dictionary[locale][key].apply(null, params);
            }
        }
    }
};