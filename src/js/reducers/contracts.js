import _ from 'lodash';


export class ContractsReducer {
    reduce(json, state) {
        let data = json;
        if(data) {
            this.contracts(data, state);
            this.abi(data, state);
        }
    }
    contracts(obj, state) {
        let data = _.has(obj, 'contracts', false);
        if (data) {
            state.contracts = obj.contracts.map(contract => {
                return {
                    name: contract.name,
                    address: contract.address,
                    specificEvents: contract['specific-events']
                }
            });
        }
    }
    abi(obj, state) {
        let data = _.has(obj, 'abi-result', false);
        if (data) {
            state.abi = obj['abi-result'] && JSON.parse(obj['abi-result']);
        }
    }
}
