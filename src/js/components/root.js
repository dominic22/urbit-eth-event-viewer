import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { api } from "/api";
import { store } from "/store";
import { NewContract } from "./new";
import { Skeleton } from "./skeleton";
import { EventLog } from './log';

export class Root extends Component {
  constructor(props) {
    super(props);
    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
  }

  renderBaseViewContent() {
    const { contracts } = this.state;
    let message = "There are no contracts, feel free to add one.";
    if (contracts && contracts.length > 0) {
      message = "Please select a contract.";
    }
    return <p className="measure center pa5 text-center">{message}</p>;
  }

  render() {
    const { contracts } = this.state;
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/~etheventviewer"
            render={() => {
              return (
                <Skeleton api={api} contracts={contracts}>
                  {this.renderBaseViewContent()}
                </Skeleton>
              );
            }}
          />
          <Route
            exact
            path="/~etheventviewer/new"
            render={() => {
              return (
                <Skeleton api={api} contracts={this.state.contracts}>
                  <NewContract
                    abi={this.state.abi}
                    api={api}
                    onAcceptClicked={state => {
                      api.action("etheventviewer", "json", {
                        "add-contract": {
                          address: state.address,
                          name: state.name,
                          'specific-events': state.specificEvents,
                          'event-logs': null,
                        }
                      });
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
                  <EventLog eventLog={this.state.eventLogs}/>
                </Skeleton>
              );
            }}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
