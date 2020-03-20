import _ from 'lodash';


export class ContractsReducer {
    reduce(json, state) {
        let data = json;
        console.log('received data', data);
        if(data) {
            console.log('parse data', data);
            this.contracts(data, state);
            this.contract(data, state);
            this.abi(data, state);
        }
    }
    contracts(obj, state) {
        let data = _.has(obj, 'contracts', false);
        if (data) {
            state.contracts = obj.contracts;
        }
    }
    abi(obj, state) {
        let data = _.has(obj, 'data', false);
        if (data) {
            state.abi = JSON.parse(obj.data.result);
            console.log('abi abi', state);
        }
    }
    contract(obj, state) {
        let data = _.has(obj, 'contract', false);
        if (data) {
            state.contract = obj.contract;
        }
    }
}
