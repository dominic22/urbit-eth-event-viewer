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
        eventLogs: this.getUniqueOrderedLogs(data['event-logs'])
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
          eventLogs: this.getUniqueOrderedLogs(contract['event-logs'])
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
      console.log('got log', eventLog);
      if (currentContract) {
        this.setContractsState(state, existingContracts, currentContract, eventLog)

        // checking every received log for uniqness would take too long so it will be debounce
        // and the state set to unique keys
        _.debounce(() => this.setContractsState(state, existingContracts, currentContract, eventLog, true), 100)();
      }
    }
  }

  setContractsState(state, existingContracts, currentContract, eventLog, unique) {
    const currentLogs = currentContract.eventLogs || []
    const logs = [...currentLogs, eventLog];

    const updatedContract = {
      ...currentContract,
      eventLogs: unique ? this.getUniqueOrderedLogs(logs, eventLog) : this.getOrderedLogs(logs)
    };
    state.contracts = [...existingContracts, updatedContract];
  }

  getOrderedLogs(logs) {
    if(!logs || logs.length === 0) {
      return [];
    }
    return _.orderBy(logs, 'mined.block-number', ['desc']);
  }

  getUniqueOrderedLogs(logs, eventLog) {
    if(!logs || logs.length === 0) {
      return [];
    }
    console.log('get uniq reversed log for log: ', eventLog);
    return _.uniqWith(this.getOrderedLogs(logs), _.isEqual);
  }

  history(obj, state) {
    let history = _.get(obj, 'history', false);
    if (history && history[0].address) {
      const address = history[0].address;

      const { existingContracts, currentContract } = this.splitContracts(state.contracts, address);
      const updatedContract = {
        ...currentContract,
        eventLogs: this.getUniqueOrderedLogs(history)
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
