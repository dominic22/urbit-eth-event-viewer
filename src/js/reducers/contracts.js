import _ from 'lodash';
import { getOrderedContracts, getOrderedLogs, mapContract, splitContracts } from './utils';

export class ContractsReducer {
  reduce(json, state) {
    let data = json;
    if (data) {
      this.newContract(data, state);
      this.removeContract(data, state);
      this.contracts(data, state);
      this.abi(data, state);
      this.blockNumber(data, state);
      this.eventLogs(data, state);
    }
  }

  removeContract(obj, state) {
    let data = _.get(obj, 'remove-contract', false);
    if (data) {
      state.contracts = getOrderedContracts(state.contracts.filter(contract => contract.address !== data));
    }
  }

  newContract(obj, state) {
    let data = _.get(obj, 'new-contract', false);
    if (data) {
      const newContract = mapContract(data);
      state.contracts = getOrderedContracts([
        ...state.contracts,
        newContract
      ]);
    }
  }

  contracts(obj, state) {
    let data = _.get(obj, 'contracts', false);
    if (data) {
      state.contracts = getOrderedContracts(data.map(contract => mapContract(contract)));
    }
  }

  abi(obj, state) {
    let data = _.get(obj, 'abi-res', false);

    if (data) {
      try {
        state.abi = data && JSON.parse(data);
      } catch (e) {
        console.error('Error while receiving data: ', data)
        console.error(e);
      }
    }
  }

  blockNumber(obj, state) {
    let blockNumber = _.get(obj, 'block-number-res', false);

    if (blockNumber) {
      if(isNaN(+blockNumber)) {
        console.error('Error while receiving block number: ', blockNumber);
        return;
      }
      state.blockNumber = blockNumber;
    }
  }

  eventLogs(obj, state) {
    const eventLogs = _.get(obj, 'event-logs', false);
    if (eventLogs) {
      if (!eventLogs || !eventLogs[0].address) {
        console.error('no address found in event logs');
        return;
      }
      const address = eventLogs[0].address;
      const { existingContracts, currentContract } = splitContracts(state.contracts, address);
      if (currentContract) {
        this.setContractsState(state, existingContracts, currentContract, eventLogs)
      }
    }
  }

  setContractsState(state, existingContracts, currentContract, eventLogs) {
    const currentLogs = currentContract.eventLogs || []
    const logs = [...currentLogs, ...eventLogs];

    const updatedContract = {
      ...currentContract,
      eventLogs: getOrderedLogs(logs)
    };
    state.contracts = getOrderedContracts([...existingContracts, updatedContract]);
  }
}
