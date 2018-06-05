import {HttpServerUnavailable} from "../http/index";

export default class DataSourceSyncQueue {

    get http() {
        // e.g. return "https://example.com";
        throw new Error(`Property 'http' should be defined in model '${this.constructor.name}'`);
    }

    get retryTimeout() {
        return 5000;
    }

    constructor(source) {
        this._isSyncing = false;
        this._isServerAvailable = true;
        this._source = source;
    }

    shift() {
        if (this._isSyncing || !this._isServerAvailable) {
            return;
        }

        this._syncNext();
    }

    _syncNext() {
        const nextModification = this._source.pullVault("_modifications")[0];

        if (nextModification) {
            this._sync(nextModification);
        } else {
            this.setSyncingState(false);
        }
    }

    _sync(modification) {
        this.setSyncingState(true);
        this.http.fetchApi(modification.apiUrl, modification.method, modification.data)
            .then(response => {
                this._source.pullVault("_modifications").shift();
                this.setServerAvailable(true);
                return response;
            })
            .then(modification.complete)
            .then(this._source.store.bind(this._source))
            .then(this._syncNext.bind(this))
            .catch(error => {
                if (!(error instanceof HttpServerUnavailable)) {
                    throw error;
                }
                this.setSyncingState(false);
                this.setServerAvailable(false);

                setTimeout(() => (this._isServerAvailable = true, this.shift()), this.retryTimeout);
            });
    }

    setServerAvailable(state) {
        this._isServerAvailable = state;
    }

    setSyncingState(state) {
        this._isSyncing = state;
    }

}