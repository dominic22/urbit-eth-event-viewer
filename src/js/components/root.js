import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { api } from '/api';
import { store } from '/store';
import { HeaderBar } from './lib/header-bar.js';
import { ContractsSidebar } from './lib/contracts-sidebar';
import { NewContractForm } from './lib/new-contract-form';

export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
  }

  handleContractChange(event) {
    this.setState({ contract: event.target.value });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
          <HeaderBar/>
          <Route
            exact
            path="/~etheventviewer"
            render={() => {
              return (
                <div
                  className="cf w-100 flex flex-column ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl">
                  <div className="flex flex-column flex-row ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d">
                    <div className="pa4 black-80 w-50 pl3">
                      Shall we add some filters here?
                    </div>
                    <div className="w-60 pa4 w-50 pl3">
                      {this.renderActionButtons()}
                    </div>
                  </div>
                  {this.renderContent()}
                </div>
              );
            }}
          />
        </div>
      </BrowserRouter>
    );
  }

  renderContent() {
    const { contracts } = this.state;
    if (!contracts) {
      return (
        <p className="measure center pa5">
          There are no contracts, feel free to add one.
        </p>
      );
    }
  // const resourcePath = '/' + this.props.match.params.resource;
  // console.log('path ', resourcePath);
    return (
      <div className="flex flex-column flex-row h-100">
        <ContractsSidebar
          api={api}
          contracts={contracts}/>
        <div className="pa3 mb4 mb0 w-100">
          <NewContractForm
            abi={this.state.abi}
            onInputsChanged={state => console.log('contract', state.contract, ' alias', state.alias)}
            onAcceptClicked={state => {
              console.log('contract', state.contract, ' alias', state.alias)
              console.log('Send action json');
              api.action('etheventviewer', 'json', {
                'add-contract': {
                  contract: state.contract
                }
              })
            }}
          />
        </div>
      </div>
    );
  }

  renderActionButtons() {
    return <>
      <a
        key="initial"
        className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
        onClick={() => {
          console.log('Send contract action json 2s');
          api.action('etheventviewer', 'json', {
            create: {
              contract: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413'
            }
          });
        }}
      >
        initial
      </a>
      <a
        key="subscribe"
        className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
        onClick={() => {
          console.log('Send subscribe');
          api.action('etheventviewer', 'json', {
            subscribe: {
              contract: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413'
            }
          });
        }}
      >
        subscribe
      </a>
      <a
        key="unsubscribe"
        className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
        onClick={() => {
          console.log('Send unsubscribe');
          api.action('etheventviewer', 'json', {
            unsubscribe: {
              contract: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413'
            }
          });
        }}
      >
        unsubscribe
      </a>
    </>
  }
}
