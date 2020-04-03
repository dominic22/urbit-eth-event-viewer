import _ from 'lodash';


export class ContractsReducer {
    reduce(json, state) {
        let data = json;
        if(data) {
            this.contracts(data, state);
            this.abi(data, state);
            this.eventLogs(data, state);
        }
    }
    contracts(obj, state) {
        let data = _.has(obj, 'contracts', false);
        if (data) {
            state.contracts = obj.contracts.map(contract => {
                return {
                    name: contract.name,
                    address: contract.address,
                    specificEvents: contract['specific-events'],
                    eventLog: contract['event-log']
                }
            });
        }
    }
    abi(obj, state) {
        let data = _.has(obj, 'abi-result', false);
        console.log('abi- ', obj['abi-result']);
        if (data) {
            state.abi = obj['abi-result'] && JSON.parse(obj['abi-result']);
        }
    }

    eventLogs(obj, state) {
        let data = _.has(obj, 'event-logs', false);
        console.log('EVENTLOGS ', data);
        if (data) {
            state.eventLogs = obj['event-logs'];
        }
    }
}
