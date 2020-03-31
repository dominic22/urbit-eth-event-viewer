import { api } from '/api';
import { store } from '/store';

import urbitOb from 'urbit-ob';


export class Subscription {
  start() {
    if (api.authTokens) {
      this.initializeetheventviewer();
    } else {
      console.error("~~~ ERROR: Must set api.authTokens before operation ~~~");
    }
  }

  initializeetheventviewer() {
    api.bind('/primary', 'PUT', api.authTokens.ship, 'etheventviewer',
      this.handleEvent.bind(this),
      this.handleError.bind(this));

    api.bind(
      "/state/update",
      "PUT",
      api.authTokens.ship,
      "etheventviewer",
      this.handleStateUpdateEvent.bind(this),
      this.handleError.bind(this)
    );
    api.bind(
      "/etheventviewer/eth-watcher-update",
      "PUT",
      api.authTokens.ship,
      "etheventviewer",
      this.handleEthWatcherUpdate.bind(this),
    );
    // TODO
    api.bind(
      "/" + api.authTokens.ship +"/etheventviewer",
      "PUT",
      api.authTokens.ship,
      "etheventviewer",
      this.handleEthWatcherUpdate.bind(this),
    );
  }

  handleEvent(diff) {
    store.handleEvent(diff);
  }

  handleStateUpdateEvent(diff) {
    console.log('update from gall received ', diff);
    store.handleStateUpdateEvent(diff);
  }
  handleEthWatcherUpdate(diff) {
    store.handleEthWatcherUpdate(diff);
  }

  handleError(err) {
    console.error(err);
    api.bind('/primary', 'PUT', api.authTokens.ship, 'etheventviewer',
      this.handleEvent.bind(this),
      this.handleError.bind(this));
  }
}

export let subscription = new Subscription();
