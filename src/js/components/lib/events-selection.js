import React, { Component } from 'react';
import { Checkbox } from './checkbox';


export class EventsSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvents: [],
      eventListDisabled: false,
    }
  }

  render() {
    return this.renderEventsSelection();
  }

  renderEventsSelection() {
    const { abi } = this.props;
    const { selectedEvents, eventListDisabled } = this.state;
    if (!abi || abi.length === 0) {
      return <p className="f8">No Events found...</p>;
    }
    return (<div>
      <form className="mb4">
        <fieldset id="favorite_movies" className={`bn pa0 ml0 ${eventListDisabled ? 'o-70 pointer-none' : ''}`}>
          <p className="f8 lh-copy mb2">Select contract events:</p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {
              abi
                .filter(topics => topics.type === 'event')
                .map(event => {
                  return (<Checkbox
                    label={event.name}
                    toggle={() => this.toggleFromEvents(event.name)}
                    isActive={selectedEvents.some(eventName => eventName === event.name)}/>)
                })}
          </div>
        </fieldset>
      </form>
      <Checkbox
        label={'Listen to all events'}
        toggle={() => this.toggleEventListDisabled()}
        isActive={eventListDisabled}/>
    </div>);
  }

  toggleEventListDisabled() {
    this.setState({ eventListDisabled: !this.state.eventListDisabled });
  }

  selectAllEvents() {
    const { abi } = this.props;
    this.setState({
      selectedEvents: abi.filter(topics => topics.type === 'event').map(event => event.name)
    }, this.toggleEventChanged);
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
    if (this.props.onEventsChanged) {
      this.props.onEventsChanged(this.state.selectedEvents);
    }
  }
}
