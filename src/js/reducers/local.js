import _ from 'lodash';


export class LocalReducer {
    reduce(json, state) {
        let data = _.get(json, 'local', false);
        if (data) {
            this.setInput(data, state);
            this.setSelectedContract(data, state);
        }
        data = _.get(json, 'eventupdate', false);
        console.log('EVENTS REDUCER ', json);
        if (data) {
            this.add(data, state);
            this.remove(data, state);
        }
    }
    add(obj, state) {
        console.log('ADD ', obj);
        let data = _.get(obj, 'add', false);
        if (data) {
            state.selectedEvents = [...state.selectedEvents, data.eventName];
        }
    }

    remove(obj, state) {
        let data = _.get(obj, 'remove', false);
        if (data) {
            state.selectedEvents = state.selectedEvents.filter(event => event === data.eventName);
        }
    }
    setInput(obj, state) {
        console.log('set input reducer');
        let data = _.has(obj, 'inputValue', false);
        if (data) {
            state.inputValue = obj.inputValue;
        }
    }

    setSelectedContract(obj, state) {
        const selectedContract = _.get(obj, 'selectedContract', false);
        if (selectedContract) {
            state.selectedContract = selectedContract;
        }
        console.log('SELECETEFDASDAWD AWD AWD ');
    }
}
