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
      this.history(data, state);
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
        eventLogs: this.getReversedLogs(data['event-logs'])
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
          eventLogs: this.getReversedLogs(contract['event-logs'])
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
      const { existingContracts, currentContract } = this.splitContracts(state.contracts, eventLog.address);
      const currentLogs = currentContract.eventLogs || []

      const logs = [...currentLogs, eventLog];
      const updatedContract = {
        ...currentContract,
        eventLogs: this.getReversedLogs(logs)
      };

      if (currentContract) {
        state.contracts = [...existingContracts, updatedContract];
      }
    }
  }

  getReversedLogs(logs) {
    if(!logs || logs.length === 0) {
      return [];
    }
    return _.uniqWith(logs, _.isEqual).reverse();
  }

  history(obj, state) {
    let history = _.get(obj, 'history', false);
    if (history && history[0].address) {
      const address = history[0].address;

      const { existingContracts, currentContract } = this.splitContracts(state.contracts, address);
      const updatedContract = {
        ...currentContract,
        eventLogs: this.getReversedLogs(history)
      };
      if (currentContract) {
        state.contracts = [...existingContracts, updatedContract];
      }
    }
  }

  splitContracts(contracts, address) {
    const existingContracts = contracts.filter(contract => contract.address !== address);
    const currentContract = contracts.find(contract => contract.address === address);
    return { existingContracts, currentContract };
  };
}
