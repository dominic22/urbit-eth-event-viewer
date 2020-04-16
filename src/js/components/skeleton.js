import React, { Component } from "react";
import { HeaderBar } from "./lib/header-bar";
import { ContractsSidebar } from "./lib/contracts-sidebar";

export class Skeleton extends Component {
  render() {
    return (
      <div className="absolute h-100 w-100 bg-gray0-d ph4-m ph4-l ph4-xl pb4-m pb4-l pb4-xl">
        <HeaderBar />
        <div className="cf w-100 flex flex-column ba-m ba-l ba-xl b--gray2 br1 h-100 h-100-minus-40-m h-100-minus-40-l h-100-minus-40-xl">
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
      </div>
    );
  }

  renderContent() {
    const { api, children, contracts, selectedContract } = this.props;

    return (
      <div className="flex flex-column flex-row h-100-minus-56">
        <ContractsSidebar
          api={api}
          selectedContract={selectedContract}
          contracts={contracts}
        />
        <div className="mb4 mb0 w-100-minus-384">{children}</div>
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
      </>
    );
  }
}
