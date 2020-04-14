import React, { Component } from 'react';
import { getEventHashPairs } from '../lib/events';
import { Filter } from './lib/filter';
import _ from 'lodash';
import { api } from '/api';

export class EventLogs extends Component {

  render() {
    const { contract, filterOptions } = this.props;

    if (!contract) {
      return this.renderNoDataAvailable();
    }

    let { showAllEvents, filters } = filterOptions || { filters: [], showAllEvents: true };
    const hashPairs = getEventHashPairs(contract.abiEvents);
    console.log('current contract: ', contract);
    console.log('Hash pairs ', hashPairs);

    let logs = contract.eventLogs || [];

    if (!showAllEvents && filters.length > 0) {
      logs = this.filterLogs(logs, hashPairs, filters);
    }

    // show max 100 entries
    logs = _.take(logs, 100);

    // Displays events, per contract+config or for all watched, in readable format
    // (ie, "Transfer: from: 0xabc, to: 0xdef, value: 123", with block number or timestamp, link to transaction on Etherscan.")
    return (<div className="h-100">
        {this.renderFilterBar(contract.address, showAllEvents, hashPairs, filters)}
        {
          logs.length > 0 ? this.renderLog(logs, hashPairs, contract) : this.renderNoDataAvailable()
        }
      </div>
    )
  }

  renderFilterBar(address, showAllEvents, hashPairs, filters) {
    return <div className="flex flex-column flex-row ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d overflow-scroll"
                style={{ overflowY: 'hidden' }}>
      <Filter label="Show all Events" isActive={!showAllEvents} onClick={() => {
        // this.setState({ showAllEvents: !showAllEvents })
        api.setShowAllEvents(address, !showAllEvents);
        console.log('toggle');
      }}/>
      {
        showAllEvents || (hashPairs && this.renderFilters(hashPairs, filters))
      }
    </div>
  }

  renderLog(logs, hashPairs, contract) {
    return <div className="h-100-minus-60 overflow-auto pa4">
      <ul className="list pl0 ma0">
        {
          logs
            .map(eventLog => {
              return (
                <a
                  href={`https://etherscan.io/tx/${eventLog.mined['transaction-hash']}`}
                  key={eventLog.mined['transaction-hash'] + eventLog.mined['block-number'] + eventLog.mined['log-index']}
                  target={'_blank'}
                >
                  {this.renderListItem(eventLog, hashPairs, contract.abiEvents)}
                </a>
              );
            })
        }
      </ul>
    </div>;
  }

  renderNoDataAvailable() {
    return <div className="pl3 pr3 pt2 dt pb3 w-100 h-100-minus-56">
      <div className="f8 pt3 gray2 w-100 h-100 dtc v-mid tc">
        <p className="w-100 tc mb2">No contract data available.</p>
        <p className="w-100 tc">It might need some time, pick a coffee and lean back.</p>
      </div>
    </div>;
  }

  renderFilters(hashPairs, filters) {
    const { contract } = this.props;
    const specificEvents = contract.specificEvents.map(event => {
      const name = event.split('(');
      return name ? name[0] : null;
    }).filter(name => name);

    return hashPairs
      .filter(p => specificEvents.length > 0 ? specificEvents.some(ev => ev === p.name) : true)
      .map(pair => {
        return (
          <Filter key={pair.name}
                  isActive={filters.some(filter => filter === pair.name)}
                  label={pair.name}
                  onClick={() => this.toggleFilter(pair.name, filters)}/>
        )
      })
  }

  renderListItem(eventLog, hashPairs) {
    const hashPair = hashPairs.find(hash => hash.hash === eventLog.topics[0]);

    return (
      <li
        className={'lh-copy pl3 pv3 ba bl-0 bt-0 br-0 b--solid b--gray4 b--gray1-d bg-animate pointer'}
      >
        <div className="flex flex-column flex-row">
          <div key="transaction-info" style={{ width: '180px' }}>
            <p className="f9">{hashPair ? hashPair.name : '-'}</p>
            <p className="f9 gray3">Block No. {eventLog.mined['block-number']}</p>
          </div>
          {
            eventLog.topics.map((topic, index) => {
              // first index is hash of topics
              if (index === 0) {
                return null;
              }
              const topicIndex = index - 1;
              return (<div className="ml2" key={topic + topicIndex} style={{ minWidth: '100px' }}>
                <p className="f9">{hashPair && hashPair.inputs[topicIndex] && hashPair.inputs[topicIndex].name}</p>
                <p className="f9 gray3">{topic}</p>
              </div>)
            })
          }
        </div>
      </li>
    );
  }

  filterLogs(logs, hashPairs, filters) {
    return logs.filter(log => {
      const filterHash = filter => hashPairs.find(pair => pair.name === filter) || { hash: null };
      return !filters.some(filter => filterHash(filter).hash === log.topics[0])
    });
  }

  toggleFilter(eventName, filters) {
    if (filters.some(filter => filter === eventName)) {
      this.removeFilter(eventName, filters);
    } else {
      this.addFilter(eventName, filters);
    }
  }

  addFilter(eventName, filters) {
    api.setEventFilters(this.props.contract.address, [...filters, eventName]);
  }

  removeFilter(eventName, filters) {
    api.setEventFilters(this.props.contract.address, filters.filter(filter => filter !== eventName));
  }
}
