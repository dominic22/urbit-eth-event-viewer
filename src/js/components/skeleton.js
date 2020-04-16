import React, { Component } from "react";
import { HeaderBar } from "./lib/header-bar";
import { ContractsSidebar } from "./lib/contracts-sidebar";
import { api } from '/api';

export class Skeleton extends Component {
  render() {
    return (
      <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
        <HeaderBar />
        <div className="cf w-100 flex flex-column ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl">
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    const { children, contracts, selectedContract } = this.props;

    return (
      <div className="flex flex-column flex-row h-100">
        <ContractsSidebar
          selectedContract={selectedContract}
          contracts={contracts}
        />
        <div className="mb0 w-100-minus-320">{children}</div>
      </div>
    );
  }

  renderActionButtons() {
    const {selectedContract} = this.props;
    return (
      <>
        <a
          key="watch"
          className="dib f9 pa3 bt bb bl br tc pointer bg-white b--gray4"
          onClick={() => {
            console.log("Send watch");
            api.action("etheventviewer", "json", {
              watch: {
                address: selectedContract
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
                address: selectedContract
              }
            });
          }}
        >
          leave
        </a>
      </>
    );
  }
}
