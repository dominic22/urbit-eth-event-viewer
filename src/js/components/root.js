import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { api } from '/api';
import { store } from '/store';
import { HeaderBar } from './lib/header-bar.js';

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
                      {this.renderInput()}
                    </div>
                    <div className="w-60 pa4 w-50 pl3">
                      {this.renderActionButtons()}
                    </div>
                  </div>
                  {this.renderContractsList()}
                </div>
              );
            }}
          />
        </div>
      </BrowserRouter>
    );
  }

  renderInput() {
    return (<div className="flex flex-column flex-row">
      <textarea
        id="name"
        className="ba b--black-20 pa3 db w-70 b--gray4 f9 flex-basis-full-s focus-b--black focus-b--white-d"
        type="text"
        rows={1}
        placeholder="New Contract Address"
        value={this.state.contract}
        style={{ resize: 'none', width: '382px' }}
        onChange={this.handleContractChange.bind(this)}
        aria-describedby="name-desc"
      />
      <a
        className="dib f9 pa3 bt bb bl br tc pointer bg-white ml3 b--gray4"
        onClick={() => {
          console.log('Send action json');
          api.action('etheventviewer', 'json', {
            'add-contract': {
              contract: this.state.contract
            }
          });
        }}
      >
        Add Contract
      </a>
    </div>);
  }

  renderContractsList() {
    const { contracts, selectedContract } = this.state;
    if (!contracts) {
      return (
        <p className="measure center pa5">
          There are no contracts, feel free to add one.
        </p>
      );
    }

    return (
      <div className="flex flex-column flex-row h-100">
        <div className="flex-basis-full-s flex-basis-300-m flex-basis-300-l
              flex-basis-300-xl">
          <ul className="list pl0 ma0 ba bl-0 bt-0 bb-0 b--solid b--gray4 b--gray1-d h-100">
            {contracts.map(contract => {
              return (
                <li
                  key={contract}
                  className={`lh-copy pl3 pv3 ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d bg-animate pointer ${selectedContract === contract ? 'bg-gray5' : 'bg-white'}`}
                  onClick={() => this.setState({ selectedContract: contract })}
                >
                  <div className="flex flex-column flex-row justify-between ">
                    <p className="pt3 f9">{contract}</p>
                    <a
                      className="dib f9 pa3 tc pl4 pointer bg-white mr3"
                      onClick={() => {
                        api.action('etheventviewer', 'json', {
                          'remove-contract': {
                            contract: contract
                          }
                        });
                      }}
                    >
                      remove
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="pa3 mb4 mb0 w-100">
          {this.renderEventsSelection()}
        </div>
      </div>
    );
  }

  renderEventsSelection() {
    const { abi, selectedEvents } = this.state;
    if (!abi || abi.length === 0) {
      return null;
    }
    return (<div className="pa4">
      <form className="mb4">
        <fieldset id="favorite_movies" className="bn pa0 ml0">
          <p className="fw7 mb3">Select a contract event:</p>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {
              abi
                .filter(topics => topics.type === 'event')
                .map(event => {
                  return (<div key={event.name}
                               className="flex items-center mb2 pointer"
                               onClick={() => this.toggleFromEvents(event.name)}>
                    <div className="flex mr3 f6 lh-tall us-none pointer flex-row align-center">
                      <div className={`flex align-center justify-center p1 mr3 white b--gray4 b--gray1-d ba
               ${selectedEvents.some(eventName => eventName === event.name) ? ' bg-black' : ' bg-white'}`}
                           style={{
                             height: '24px',
                             width: '24px'
                           }}>{selectedEvents.some(eventName => eventName === event.name) && '✓'}
                      </div>
                      {event.name}
                    </div>
                  </div>)
                })}
          </div>
        </fieldset>
      </form>
      <div className="flex">
        <button className="db f9 green2 ba pa2 b--green2 bg-gray0-d pointer" onClick={() => console.log('aa')}>Accept
        </button>
        <button className="f9 ml3 ba pa2 b--black pointer bg-transparent b--white-d white-d"
                onClick={() => console.log('Sa')}>Select All
        </button>
        <button className="f9 ml3 ba pa2 b--black pointer bg-transparent b--white-d white-d"
                onClick={() => console.log('ca')}>Cancel
        </button>
      </div>
    </div>);
  }

  toggleFromEvents(eventName) {
    const { selectedEvents } = this.state;
    if (selectedEvents.some(event => event === eventName)) {
      api.events.remove(eventName);
    } else {
      console.log('add event', eventName);
      api.events.add(eventName);
    }
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
