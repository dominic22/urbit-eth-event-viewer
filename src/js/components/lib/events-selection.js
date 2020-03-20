import React, { Component } from 'react';


export class EventsSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvents: [],
    }
  }

  render() {
    return this.renderEventsSelection();
  }

  renderEventsSelection() {
    const { abi } = this.props;
    const { selectedEvents } = this.state;
    if (!abi || abi.length === 0) {
      return <p className="f8">No Events found...</p>;
    }
    return (<div className="">
      <form className="mb4">
        <fieldset id="favorite_movies" className="bn pa0 ml0">
          <p className="f8 lh-copy mb2">Select contract events:</p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {
              abi
                .filter(topics => topics.type === 'event')
                .map(event => {
                  return (<div key={event.name}
                               className="flex items-center mb2 pointer"
                               onClick={() => this.toggleFromEvents(event.name)}>
                    <div className="flex mr3 f6 lh-tall us-none pointer flex-row align-center">
                      <div className={`flex align-center justify-center p1 mr3 white b--gray4 b--gray1-d ba
               ${selectedEvents.some(eventName => eventName === event.name) ? ' bg-black' : ' bg-white'}`}
                           style={{
                             height: '24px',
                             width: '24px'
                           }}>{selectedEvents.some(eventName => eventName === event.name) && '✓'}
                      </div>
                      {event.name}
                    </div>
                  </div>)
                })}
          </div>
        </fieldset>
      </form>
      <button className="f9 ba pa2 b--black pointer bg-transparent b--white-d white-d"
              onClick={() => this.selectAllEvents()}>Select All
      </button>
    </div>);
  }

  selectAllEvents() {
    const {abi} = this.props;
    this.setState({
      selectedEvents:abi.filter(topics => topics.type === 'event').map(event => event.name)
    },  this.toggleEventChanged);
  }

  toggleFromEvents(eventName) {
    const { selectedEvents } = this.state;
    if (selectedEvents.some(event => event === eventName)) {
      this.setState({
        selectedEvents: selectedEvents.filter(event => event !== eventName),
      }, this.toggleEventChanged);
    } else {
      this.setState({
        selectedEvents: [...selectedEvents, eventName],
      }, this.toggleEventChanged);
    }
  }
  toggleEventChanged() {
    if(this.props.onEventsChanged) {
      this.props.onEventsChanged(this.state.selectedEvents);
    }
  }
}
