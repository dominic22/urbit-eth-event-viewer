import _ from 'lodash';

export class ContractsReducer {
  reduce(json, state) {
    let data = json;
    if (data) {
      this.newContract(data, state);
      this.removeContract(data, state);
      this.contracts(data, state);
      this.abi(data, state);
      this.eventLog(data, state);
      this.eventLogs(data, state);
    }
  }

  removeContract(obj, state) {
    let data = _.get(obj, 'remove-contract', false);
    if (data) {
      state.contracts = state.contracts.filter(contract => contract.address !== data);
    }
  }

  newContract(obj, state) {
    let data = _.get(obj, 'new-contract', false);
    if (data) {
      console.log('new contract: ', data);
      const newContract = {
        name: data.name,
        address: data.address,
        abiEvents: JSON.parse(data['abi-events']),
        specificEvents: data['specific-events'],
        eventLogs: data['event-logs']
      };
      state.contracts = [
        ...state.contracts,
        newContract
      ];
    }
  }

  contracts(obj, state) {
    let data = _.get(obj, 'contracts', false);
    if (data) {
      state.contracts = data.map(contract => {
        return {
          name: contract.name,
          address: contract.address,
          abiEvents: JSON.parse(contract['abi-events']),
          specificEvents: contract['specific-events'],
          eventLogs: contract['event-logs']
        }
      });
    }
  }

  abi(obj, state) {
    let data = _.get(obj, 'abi-result', false);
    console.log('abi- ', data);
    if (data) {
      state.abi = data && JSON.parse(data);
    }
  }

  eventLog(obj, state) {
    let data = _.get(obj, 'event-log', false);
    if (data) {
      const eventLog = data;
      const filteredContracts = state.contracts.filter(contract => contract.address !== eventLog.address);
      const contract = state.contracts.find(contract => contract.address === eventLog.address);
      const currentLogs = contract.eventLogs || []
      const updatedContract = {
        ...contract,
        eventLogs: [...currentLogs, eventLog]
      };
      if (contract) {
        state.contracts = [...filteredContracts, updatedContract];
      }
    }
  }

  eventLogs(obj, state) {
    let data = _.get(obj, 'event-logs', false);
    if (data) {
      state.eventLogs = data;
    }
  }
}
