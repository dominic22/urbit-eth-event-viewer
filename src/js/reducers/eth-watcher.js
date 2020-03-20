import _ from 'lodash';


export class EthWatcherReducer {
    reduce(json, state) {
        const data = json;
        console.log('received data', data);
        if(data) {
            this.events(data, state);
        }
    }
    events(obj, state) {
        if (data) {
            state.events = obj;
        }
    }
}
