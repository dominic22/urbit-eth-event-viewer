import _ from 'lodash';


export class ContractsReducer {
    reduce(json, state) {
        let data = json;
        console.log('received data', data);
        if (data) {
            state.contracts = data.contracts || state.contracts;
            state.contract = data.contract || state.contracts;
        }
    }
}
