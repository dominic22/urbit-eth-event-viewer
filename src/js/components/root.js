import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
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

  renderBaseViewContent() {
    const {contracts} = this.state;
    let message = 'There are no contracts, feel free to add one.';
    if(contracts && contracts.length > 0) {
      message = 'Please select a contract.';
    }
    return (<p className="measure center pa5">{message}</p>)
  }

  render() {
    const {contracts} = this.state;
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/~etheventviewer"
            render={() => {
              return (
                <Skeleton
                  api={api}
                  contracts={contracts}
                  >
                  { this.renderBaseViewContent() }
                </Skeleton>
              );
            }}
          />
          <Route
            exact
            path="/~etheventviewer/new"
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
          <Route
            exact
            path="/~etheventviewer/:contract"
            render={props => {
              return (
                <Skeleton
                  api={api}
                  selectedContract={props.match.params.contract}
                  contracts={this.state.contracts}
                >
                  <p>Content of selected contract</p>
                </Skeleton>
              );
            }}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
