import S from "s-js";
import SArray from "s-array";

export default class DataSourceSignalsArray {
    constructor(sArray) {
        this.entry = sArray || SArray([]);
    }

    toJSON() {
        return S.sample(this.entry).map(dataSourceSignal => dataSourceSignal.toJSON());
    }
}
