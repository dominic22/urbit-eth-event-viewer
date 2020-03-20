import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class UrbitApi {
  setAuthTokens(authTokens) {
    this.authTokens = authTokens;
    this.bindPaths = [];

    this.events = {
      add: this.add.bind(this),
      remove: this.remove.bind(this)
    };
  }

  bind(path, method, ship = this.authTokens.ship, appl = "etheventviewer", success, fail) {
    this.bindPaths = _.uniq([...this.bindPaths, path]);

    window.subscriptionId = window.urb.subscribe(ship, appl, path, 
      (err) => {
        fail(err);
      },
      (event) => {
        success({
          data: event,
          from: {
            ship,
            path
          }
        });
      },
      (err) => {
        fail(err);
      });
  }

  etheventviewer(data) {
    this.action("etheventviewer", "json", data);
  }

  action(appl, mark, data) {
    return new Promise((resolve, reject) => {
      window.urb.poke(ship, appl, mark, data,
        (json) => {
          resolve(json);
        }, 
        (err) => {
          reject(err);
        });
    });
  }

  add(eventName) {
    store.state.selectedEvents = [...store.state.selectedEvents, eventName]
    store.setState({selectedEvents : store.state.selectedEvents});
  }

  remove(eventName) {
    store.state.selectedEvents = store.state.selectedEvents.filter(event => event !== eventName)
    store.setState({selectedEvents: store.state.selectedEvents});
  }
}
export let api = new UrbitApi();
console.log('api ', api.events);
window.api = api;
