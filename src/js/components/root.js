import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { api } from '/api';
import { store } from '/store';
import { NewContractForm } from './lib/new-contract-form';
import { Skeleton } from './skeleton';

export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
  }

  render() {
    return (
      <BrowserRouter>
          <Route
            exact
            path="/~etheventviewer"
            render={() => {
              return (
                <Skeleton
                  api={api}
                  contracts={this.state.contracts}
                  >
                  <NewContractForm
                    abi={this.state.abi}
                    onInputsChanged={state => console.log('contract', state.contract, ' alias', state.alias)}
                    onAcceptClicked={state => {
                      console.log('contract', state.contract, ' alias', state.alias)
                      console.log('Send action json');
                      api.action('etheventviewer', 'json', {
                        'add-contract': {
                          contract: state.contract,
                          alias: state.alias
                        }
                      })
                    }}
                  />
                </Skeleton>
              );
            }}
          />
      </BrowserRouter>
    );
  }
}
