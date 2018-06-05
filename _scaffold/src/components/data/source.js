import Http from './http';
import {DataSource} from 'ruth';
import DataSourceSyncQueue from '../../../src/data-source/sync-queue';
import Ruth from "../../../src/index";

export default class BeerMapDataSource extends DataSource {
    constructor() {
        super();

        this.syncQueue = new BeerMapDataSourceSyncQueue(this);

        // this.pushVault("_version", 1);


        const updateServerAvailable = () => {
            Ruth.dataSource.pushRuntime("serverAvailable", window.navigator.onLine);
        };

        window.addEventListener('online', updateServerAvailable);
        window.addEventListener('offline', updateServerAvailable);
    }
}

class BeerMapDataSourceSyncQueue extends DataSourceSyncQueue {
    get http() {
        return Http;
    }

    setServerAvailable(state) {
        super.setServerAvailable(state);
        Ruth.dataSource.pushRuntime("serverAvailable", state);

    }

    setSyncingState(state) {
        super.setSyncingState(state);
        Ruth.dataSource.pushRuntime("remoteSyncing", state);
    }
}


Ruth.addComponent("dataSource", BeerMapDataSource);
