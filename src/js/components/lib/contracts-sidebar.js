import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class ContractsSidebar extends Component {
  render() {
    return (
      <div
        className="flex-basis-full-s flex-basis-300-m flex-basis-300-l
              flex-basis-300-xl ba bl-0 bt-0 bb-0 b--solid b--gray4 b--gray1-d"
      >
        <div
          className="w-100 bg-transparent pa4 bb b--gray4 b--gray1-d"
          style={{ paddingBottom: '13px' }}
        >
          <Link to="/~etheventviewer/new">
            <p className="dib f9 pointer green2 gray4-d mr4">New Contract</p>
          </Link>
        </div>
        {this.renderContractsList()}
      </div>
    );
  }

  renderContractsList() {
    const { contracts } = this.props;

    if (!contracts) {
      return null;
    }
    return (
      <ul className="list pl0 ma0">
        {contracts.map(contract => {
          return (
            <Link
              to={`/~etheventviewer/${contract.address}`}
              key={contract.address + contract.name}
            >
              {this.renderListItem(contract)}
            </Link>
          );
        })}
      </ul>
    );
  }

  renderListItem(contract) {
    const { selectedContract } = this.props;
    return (
      <li
        className={`lh-copy pl3 pv3 ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d bg-animate pointer ${
          selectedContract === contract.address ? 'bg-gray5' : 'bg-white'
        }`}
      >
        <div className="flex flex-column flex-row justify-between ">
          <div>
            {contract.name && <p className="f8">{contract.name}</p>}
            <p className="f9 gray3">{contract.address}</p>
          </div>
          <div
            className="dib f9 pa3 tc pl4 pointer mr3"
            onClick={() => this.removeContract(contract)}
          >
            remove
          </div>
        </div>
      </li>
    );
  }

  removeContract(contract) {
    const { address, name, specificEvents } = contract;
    const { api } = this.props;
    api.action('etheventviewer', 'json', {
      'remove-contract': {
        address,
        name,
        'specific-events': specificEvents,
      }
    });
  }
}
