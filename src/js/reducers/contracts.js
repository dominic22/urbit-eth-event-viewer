import _ from 'lodash';


export class ContractsReducer {
    reduce(json, state) {
        let data = json;
        if(data) {
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
            state.abi = obj.data && obj.data.result && JSON.parse(obj.data.result);
        }
    }
    contract(obj, state) {
        let data = _.has(obj, 'contract', false);
        if (data) {
            state.contract = obj.contract;
        }
    }
}
