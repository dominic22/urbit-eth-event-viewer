import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export class ContractsSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedContract: '',
    }
  }

  render() {
    return this.renderSidebar();
  }

  renderSidebar() {
    return (<div className="flex-basis-full-s flex-basis-300-m flex-basis-300-l
              flex-basis-300-xl ba bl-0 bt-0 bb-0 b--solid b--gray4 b--gray1-d">
      <div className="w-100 bg-transparent pa4 bb b--gray4 b--gray1-d" style={{ paddingBottom: '13px' }}>
        <Link to="/~etheventviewer/new">
          <a className="dib f9 pointer green2 gray4-d mr4">New Contract</a>
        </Link>
      </div>
      {this.renderContractsList()}
    </div>);
  }
  renderContractsList() {
    const {api, contracts } = this.props;
    const { selectedContract } = this.state;

    if(!contracts) {
      return null;
    }
    return (<ul className="list pl0 ma0">
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
                className="dib f9 pa3 tc pl4 pointer mr3"
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
    </ul>)
  }
}
