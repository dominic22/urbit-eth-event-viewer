import _ from 'lodash';


export class LocalReducer {
    reduce(json, state) {
        let data = _.get(json, 'local', false);
        if (data) {
            this.setInput(data, state);
            this.setSelectedContract(data, state);
        }
    }

    setInput(obj, state) {
        let data = _.has(obj, 'inputValue', false);
        if (data) {
            state.inputValue = obj.inputValue;
        }
    }

    setSelectedContract(obj, state) {
        let data = _.has(obj, 'selectedContract', false);
        if (data) {
            state.selectedContract = obj.selectedContract;
        }
    }
}
