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

    if(!contract || !contract.eventLogs) {
      return <div className="pl3 pr3 pt2 dt pb3 w-100 h-100">
        <div className="f8 pt3 gray2 w-100 h-100 dtc v-mid tc">
          <p className="w-100 tc mb2">No contract data available.</p>
          <p className="w-100 tc">It might need some time, pick a coffee and lean back.</p>
        </div>
      </div>
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
                  <a
                    href={`https://etherscan.io/tx/${eventLog.mined['transaction-hash']}`}
                    key={Math.random()}
                    target={'_blank'}
                  >
                    {this.renderListItem(eventLog, hashPairs, contract.abiEvents)}
                  </a>
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
          <div key="transaction-info" style={{width:'180px'}}>
            <p className="f9">{hashPair ? hashPair.name : '-'}</p>
            <p className="f9 gray3">Block No. {eventLog.mined['block-number']}</p>
          </div>
          {
            eventLog.topics.map((topic, index) => {
              // first index is hash of topics
              if(index === 0) {
                return null;
              }
              const topicIndex = index - 1;
              return (<div className="ml2" key={topic + topicIndex} style={{minWidth:'100px'}}>
                <p className="f9">{hashPair && hashPair.inputs[topicIndex] && hashPair.inputs[topicIndex].name}</p>
                <p className="f9 gray3">{topic}</p>
              </div>)
            })
          }
        </div>
      </li>
    );
  }
}
