import S from "s-js";
import DataSourceSignalsArray from "./signals-array";

const dataSourceModels = [];

export class DataSource {

    static addSourceModel(modelConstructor) {
        if (dataSourceModels.includes(modelConstructor)) {
            throw new Error(`Model '${modelConstructor.name}' already registered in DataSource.`);
        }
        dataSourceModels.push(modelConstructor);
    }

    constructor() {
        this._isLocked = false;
        this._isWarmedup = false;

        this.vault = {
            _modifications: []
        };

        this.runtime = {};
        this.models = dataSourceModels.reduce((models, modelConstructor) => (models[modelConstructor.name] = new modelConstructor(this), models), {});

        this.syncQueue = {
            shift() {
                throw Error(`Property 'syncQueue' should be defined in model '${this.constructor.name}'`);
            }
        }
    }

    pullVault(key, defaultValue) {
        if (!(key in this.vault)) {
            this.pushVault(key, defaultValue);
        }
        return this.vault[key];
    }

    pushVault(key, value) {
        this.vault[key] = value;
        this.store();
    }

    pullRuntime(key, defaultValue, trackEvents = false) {
        if (!(key in this.runtime)) {
            this.pushRuntime(key, defaultValue, trackEvents);
        }
        return this.runtime[key];
    }

    pushRuntime(key, value, trackAssignment = false) {
        if (key in this.runtime) {
            this.runtime[key](value);
        } else {
            this.runtime[key] = trackAssignment ? S.data(value) : S.value(value);
        }
    }

    modify(modification) {
        this.vault._modifications.push(modification);
        this.store();

        setTimeout(() => {
            this.syncQueue.shift();
        });
    }

    store() {
        if (!this._isWarmedup) {
            throw Error(`Writing in not warmed-up storage is not allowed.`);
        }
        if (this._isLocked) {
            return;
        }
        window.localStorage.vault = JSON.stringify(this.vault);
    }

    retrieveLocal() {
        if (!window.localStorage.vault) {
            return this.retrieveRemote();
        }

        const vault = JSON.parse(window.localStorage.vault);
        this._isWarmedup = true;
        this._isLocked = true;
        vault._modifications.forEach(modification => this.modify.call(this, modification));
        Object.keys(this.models).forEach(modelName => {
            vault[modelName] && vault[modelName].forEach(model => this.models[modelName].post(model, true));
        });
        this._isLocked = false;


        console.log(`Storage usage: ${(window.localStorage.vault.length / 1024).toFixed(2)}KB`);

        return Promise.resolve();
    }

    retrieveRemote() {
        this._isWarmedup = true;
        return Promise.all(Object.keys(this.models).map(model => this.models[model].loadFromServer()))
            .then(this.store.bind(this));
    }
};
