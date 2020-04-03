import React, { Component } from 'react';

export class EventLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const {eventLogs} = this.props;
    console.log('eventLog', eventLogs)
    // Displays events, per contract+config or for all watched, in readable format
    // (ie, "Transfer: from: 0xabc, to: 0xdef, value: 123", with block number or timestamp, link to transaction on Etherscan.")
    return (<div className="pa4">
        <div className="overflow-auto">
          <table className="f6 w-100 mw8 center" cellSpacing="0">
            <thead>
            <tr>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">Block Number</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">Username</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">Email</th>
              <th className="fw6 bb b--gray4 f8 tl pb3 pr3 bg-white">ID</th>
            </tr>
            </thead>
            <tbody className="lh-copy">
            <tr>
              <td className="pv3 pr3 bb b--gray4 f8">Hassan Johnson</td>
              <td className="pv3 pr3 bb b--gray4 f8">@hassan</td>
              <td className="pv3 pr3 bb b--gray4 f8">hassan@companywithalongdomain.co</td>
              <td className="pv3 pr3 bb b--gray4 f8">14419232532474</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
