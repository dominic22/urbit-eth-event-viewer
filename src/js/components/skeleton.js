import React, { Component } from "react";
import { HeaderBar } from "./lib/header-bar";
import { ContractsSidebar } from "./lib/contracts-sidebar";

export class Skeleton extends Component {
  render() {
    const {eventLogs} = this.props;
    console.log('eventLogs ', eventLogs);

    return (
      <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
        <HeaderBar />
        <div className="cf w-100 flex flex-column ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl">
          <div className="flex flex-column flex-row ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d">
            <div className="pa4 black-80 w-50 pl3">
              Shall we add some filters here? 22
            </div>
            <div className="w-60 pa4 w-50 pl3">
              {this.renderActionButtons()}
            </div>
          </div>
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    const { api, children, contracts, selectedContract } = this.props;

    return (
      <div className="flex flex-column flex-row h-100">
        <ContractsSidebar
          api={api}
          selectedContract={selectedContract}
          contracts={contracts}
        />
        <div className="pa3 mb4 mb0 w-100">{children}</div>
      </div>
    );
  }

  renderNoContracts() {
    return (
      <p className="measure center pa5">
        There are no contracts, feel free to add one.
      </p>
    );
  }

  renderActionButtons() {
    const {selectedContract} = this.props;
    return (
      <>
        <a
          key="initial"
          className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
          onClick={() => {
            console.log("Send contract action json 2s");
            api.action("etheventviewer", "json", {
              create: {
                contract: selectedContract
              }
            });
          }}
        >
          initial1
        </a>
        <a
          key="subscribe"
          className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
          onClick={() => {
            console.log("Send subscribe");
            api.action("etheventviewer", "json", {
              subscribe: {
                contract: selectedContract
              }
            });
          }}
        >
          subscribe112
        </a>
        <a
          key="watch"
          className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
          onClick={() => {
            console.log("Send watch");
            api.action("etheventviewer", "json", {
              watch: {
                contract: selectedContract
              }
            });
          }}
        >
          watch
        </a>
        <a
          key="leave"
          className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
          onClick={() => {
            console.log("Send leave");
            api.action("etheventviewer", "json", {
              leave: {
                contract: selectedContract
              }
            });
          }}
        >
          leave
        </a>
        <a
          key="unsubscribe"
          className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
          onClick={() => {
            console.log("Send unsubscribe");
            api.action("etheventviewer", "json", {
              unsubscribe: {
                contract: selectedContract
              }
            });
          }}
        >
          unsubscribe
        </a>
      </>
    );
  }
}
