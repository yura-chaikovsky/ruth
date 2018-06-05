import S from "s-js";
import SArray from "s-array";
import DataSourceSignals from "./signals";
import DataSourceModification from "./modification";
import DataSourceSignalsArray from "./signals-array";

export default class DataSourceModel {

    get apiUrl() {
        // e.g. return "/model-name";
        throw new Error(`Property 'apiUrl' should be defined in model '${this.constructor.name}'`);
    }

    constructor(source) {
        this._source = source;
    }

    _createSignals(data) {
        const signals = new DataSourceSignals({});
        Object.keys(data).forEach(key => {
            signals[key] = Array.isArray(data[key])? new SArray(data[key]) : S.value(data[key]);
            S.root(() => {
                S.on(signals[key], () => {
                    this._source.modify(new DataSourceModification({
                        method: "PUT",
                        apiUrl: this.apiUrl,
                        data: signals.toJSON(),
                        modifiedSignal: key
                    }));
                }, undefined, true);
            });

        });

        return signals;
    }

    loadFromServer() {
        return new Promise(resolve => {
            this._source.modify(new DataSourceModification({
                method: "GET",
                apiUrl: this.apiUrl,
                complete: (response) => {
                    this._source.pullVault(this.constructor.name, new DataSourceSignalsArray()).entry.splice(0);
                    response.forEach(item => {
                        this.pushModel(this._createSignals(item));
                    });
                    resolve();
                }
            }));
        });
    }

    pushModel(signals) {
        this._source.pullVault(this.constructor.name, new DataSourceSignalsArray()).entry.push(signals);
    }

    get() {
        return this._source.pullVault(this.constructor.name, new DataSourceSignalsArray()).entry;
    }

    post(data, isRetrieving = false) {
        const signals = this._createSignals(data);
        this.pushModel(signals);
        this._source.store();
        (!isRetrieving) && this._source.modify(new DataSourceModification({
            method: "POST",
            apiUrl: this.apiUrl,
            data: signals.toJSON()
        }));
    }

    remove(signal) {
        this._source.pullVault(this.constructor.name, new DataSourceSignalsArray()).entry.remove(signal);
        this._source.store();
        this._source.modify(new DataSourceModification({
            method: "DELETE",
            apiUrl: this.apiUrl,
            data: signal.toJSON()
        }));
    }
}