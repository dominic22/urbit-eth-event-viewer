import React, { Component } from 'react';
import { getEventHashPairs } from '../lib/events';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';

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
    const hashPairs = getEventHashPairs(contract.abiEvents);
    console.log('Hash pairs ', hashPairs);
    // Displays events, per contract+config or for all watched, in readable format
    // (ie, "Transfer: from: 0xabc, to: 0xdef, value: 123", with block number or timestamp, link to transaction on Etherscan.")
    return (<div className="h-100">
        <div className="h-100 overflow-auto pa4">
          <ul className="list pl0 ma0">
            {
              contract.eventLogs.map(eventLog => {
                return (
                  <Link
                    to={'https://etherscan.io/address/0x223c067f8cf28ae173ee5cafea60ca44c335fecb#events'}
                    key={Math.random()}
                  >
                    {this.renderListItem(eventLog, hashPairs, contract.abiEvents)}
                  </Link>
                  // <tr key={Math.random()}>
                  //   <td className="pv3 pr3 bb b--gray4 f8">{eventLog.mined['block-number']}</td>
                  //   <td className="pv3 pr3 bb b--gray4 f8">{eventHash ? eventHash.name : '-'}</td>
                  //   <td className="pv3 pr3 bb b--gray4 f8">{eventLog.topics[1] || '-'}</td>
                  //   <td className="pv3 pr3 bb b--gray4 f8">{eventLog.topics[2] || '-'}</td>
                  //   <td className="pv3 pr3 bb b--gray4 f8">{eventLog.topics[3] || '-'}</td>
                  // </tr>
                );
              })
            }
          </ul>
        </div>
      </div>
    )
  }


  renderListItem(eventLog,hashPairs, abi) {
    const hashPair = hashPairs.find(hash => hash.hash === eventLog.topics[0]);

    return (
      <li
        className={'lh-copy pl3 pv3 ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d bg-animate pointer'}
      >
        <div className="flex flex-column flex-row">
          <div key="transaction-info" style={{width:'160px'}}>
            <p className="f8">Block No. {eventLog.mined['block-number']}</p>
            <p className="f9 gray3">{hashPair ? hashPair.name : '-'}</p>
          </div>
          {
            eventLog.topics.map((topic, index) => {
              // first index is hash of topics
              if(index === 0) {
                return null;
              }
              const topicIndex = index - 1;
              return (<div className="ml2" key={topic + topicIndex} style={{minWidth:'100px'}}>
                <p className="f8">{hashPair.inputs[topicIndex] && hashPair.inputs[topicIndex].name}</p>
                <p className="f9 gray3">{topic}</p>
              </div>)
            })
          }
        </div>
      </li>
    );
  }
}
