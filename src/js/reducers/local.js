import _ from 'lodash';

export class LocalReducer {
  reduce(json, state) {
    let data = _.get(json, 'local', false);
    if (data) {
      this.setFilters(data, state);
    }
  }

  setFilters(obj, state) {
    let data = _.get(obj, 'eventFilters', false);
    if (data) {
      console.log('eventFilters eventFilters ', data.eventFilters);
      state.eventFilters = data.eventFilters;
    }
  }
}
