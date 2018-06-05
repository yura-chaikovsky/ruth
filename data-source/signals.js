import S from "s-js";

export default class DataSourceSignals {
    constructor(data) {
        Object.assign(this, data);
    }

    toJSON() {
        return Object.keys(this).reduce((obj, key) => (obj[key] = S.sample(this[key]), obj), {});
    }
}
