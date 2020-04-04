import React, { Component } from 'react';
import { EventsSelection } from './lib/events-selection';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import web3Utils from 'web3-utils';

export class NewContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      name: '',
      abiEvents: '',
      specificEvents: [],
      validAddress: false,
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.abi && this.props.abi !== prevProps.abi) {
      this.setState({abiEvents: this.props.abi.filter(topics => topics.type === 'event')})
    }
  }

  render() {
    return this.renderNewContractForm();
  }

  renderNewContractForm() {
    return (<div className="flex flex-column pa3">
      <div className="flex flex-row">
        <div>
          <p className="f8 mt3 lh-copy db mb2">Contract Address</p>
          <textarea
            id="name"
            className="ba b--black-20 pa3 db w-70 b--gray4 f9 flex-basis-full-s focus-b--black focus-b--white-d"
            rows={1}
            placeholder="Beginning with 0x..."
            value={this.state.address}
            style={{ resize: 'none', width: '382px' }}
            onChange={this.handleContractChange.bind(this)}
            aria-describedby="name-desc"
          />
          {this.renderInputStatus()}
          <p className="f8 mt3 lh-copy db mb2">Name<span className="gray3"> (Optional)</span></p>
          <textarea
            id="name"
            className="ba b--black-20 pa3 db w-70 b--gray4 f9 flex-basis-full-s focus-b--black focus-b--white-d"
            rows={1}
            placeholder="My Contract Name"
            value={this.state.name}
            style={{ resize: 'none', width: '382px' }}
            onChange={this.handleNameChange.bind(this)}
            aria-describedby="name-desc"
          />
        </div>
        <div className="ml8 mt3">
          <EventsSelection
            onEventsChanged={selectedEvents => {
              this.setState({specificEvents:selectedEvents})
            }}
            abi={this.props.abi}/>
        </div>
      </div>
      <div className="flex mt3">
        <Link to="/~etheventviewer">
          <button className="db f9 green2 ba pa2 b--green2 bg-gray0-d pointer"
                  onClick={this.accept.bind(this) }>
            Add Contract
          </button>
        </Link>
        <Link to="/~etheventviewer">
        <button className="f9 ml3 ba pa2 b--black pointer bg-transparent b--white-d white-d"
                onClick={() => console.log('ca')}>
          Cancel
        </button>
        </Link>
      </div>
    </div>)
  }
  accept() {
    if(this.state.address && this.state.validAddress) {
      this.props.onAcceptClicked(this.state)
    } else {
      console.error('No valid address');
    }
  }
  renderInputStatus() {
    if(!this.state.validAddress && this.state.address) {
      return (<span className="f9 inter red2 db pt2">Must be a valid contract address.</span>);
    }
    return null;
  }
  isValidAddress(address) {
    return web3Utils.isAddress(address);
  };

  checkContractAddress(address) {
    if(!address){
      return
    }
    if(!this.isValidAddress(address)) {
      this.setState({validAddress:false});
    } else {
      this.props.api.action('etheventviewer', 'json', {
        'get-contract-events': {
          contract: address
        }
      });
      this.setState({validAddress:true});
    }
  }

  handleContractChange(event) {
    const address = event.target.value;
    _.debounce(() => this.checkContractAddress(address), 100)();
    this.setState({ address });
  }
  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
}
