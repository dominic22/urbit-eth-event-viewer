import React, { Component } from 'react';
import { getEventHashes } from '../lib/events';
import * as _ from 'lodash';

export class EventLogs extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {contract} = this.props;

    if(!contract) {
      return <p>No contract data available!!!</p>
    }
    console.log('current contract: ', contract);
    const hashes = getEventHashes(contract.abiEvents);
    console.log('getEventHashMap ', getEventHashes(contract.abiEvents));
    // Displays events, per contract+config or for all watched, in readable format
    // (ie, "Transfer: from: 0xabc, to: 0xdef, value: 123", with block number or timestamp, link to transaction on Etherscan.")
    return (<div className="h-100">
        <div className="h-100 overflow-auto pa4">
          <table className="f6 w-100 mw8 center" cellSpacing="0">
            <thead>
            <tr>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">Block Number</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">Event Name</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">From</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">To</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">Value</th>
            </tr>
            </thead>
            <tbody className="lh-copy">


            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
