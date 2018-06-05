export default class DataSourceModification {
    constructor(modification) {
        this.method = modification.method;
        this.data = modification.data;
        this.apiUrl = modification.apiUrl + (["PUT", "DELETE"].includes(this.method)? "/" + this.data.id : "");
        this.modifiedSignal = modification.modifiedSignal;
        this.complete = modification.complete || (() => {});
    }
}