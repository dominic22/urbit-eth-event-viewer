import React, { Component } from 'react';
import { EventsSelection } from './events-selection';
import { Link } from 'react-router-dom';

export class NewContractForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: '',
      alias: '',
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
            type="text"
            rows={1}
            placeholder="Beginning with 0x..."
            value={this.state.contract}
            style={{ resize: 'none', width: '382px' }}
            onChange={this.handleContractChange.bind(this)}
            aria-describedby="name-desc"
          />
          <span className="f9 inter red2 db pt2">Must be a valid contract.</span>
          <p className="f8 mt3 lh-copy db mb2">Alias</p>
          <textarea
            id="name"
            className="ba b--black-20 pa3 db w-70 b--gray4 f9 flex-basis-full-s focus-b--black focus-b--white-d"
            type="text"
            rows={1}
            placeholder="My Contract Name"
            value={this.state.alias}
            style={{ resize: 'none', width: '382px' }}
            onChange={this.handleAliasChange.bind(this)}
            aria-describedby="name-desc"
          />
        </div>
        <div className="ml8 mt3">
          <EventsSelection
            onEventsChanged={selectedEvents => console.log('events changed ', selectedEvents)}
            abi={this.props.abi}/>
        </div>
      </div>
      <div className="flex mt3">
        <Link to="/~etheventviewer">
          <button className="db f9 green2 ba pa2 b--green2 bg-gray0-d pointer"
                  onClick={() => this.props.onAcceptClicked(this.state) }>
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

  handleContractChange(event) {
    this.setState({ contract: event.target.value }, this.toggleInputsChanged);
  }
  handleAliasChange(event) {
    this.setState({ alias: event.target.value }, this.toggleInputsChanged);
  }
  toggleInputsChanged() {
    if(this.props.onInputsChanged) {
      this.props.onInputsChanged(this.state);
    }
  }
}
