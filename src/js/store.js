import { InitialReducer } from '/reducers/initial';
import { ContractsReducer } from "/reducers/contracts";
import { ConfigReducer } from '/reducers/config';
import { UpdateReducer } from '/reducers/update';
import { LocalReducer } from '/reducers/local';
import { EthWatcherReducer } from '/reducers/eth-watcher';


class Store {
    constructor() {
        this.state = {
            selectedEvents: [],
        };

        this.initialReducer = new InitialReducer();
        this.localReducer = new LocalReducer();
        this.ethWatcherReducer = new EthWatcherReducer();
        this.contractsReducer = new ContractsReducer();
        this.configReducer = new ConfigReducer();
        this.updateReducer = new UpdateReducer();
        this.setState = () => { };
    }

    setStateHandler(setState) {
        this.setState = setState;
    }

    handleEvent(data) {
        let json = data.data;

        console.log(json);
        this.initialReducer.reduce(json, this.state);
        this.configReducer.reduce(json, this.state);
        this.updateReducer.reduce(json, this.state);
        this.contractsReducer.reduce(json, this.state);
        this.localReducer.reduce(json, this.state);

        this.setState(this.state);
    }

    handleStateUpdateEvent(data) {
        let json = data.data;
        this.initialReducer.reduce(json, this.state);
        this.configReducer.reduce(json, this.state);
        this.contractsReducer.reduce(json, this.state);
        this.updateReducer.reduce(json, this.state);
        this.localReducer.reduce(json, this.state);

        this.setState(this.state);
    }

    handleEthWatcherUpdate(data) {
        let json = data.data;
        console.log('handle ethwatcher update');
        this.ethWatcherReducer.reduce(json, this.state);

        this.setState(this.state);
    }
}

export let store = new Store();
window.store = store;