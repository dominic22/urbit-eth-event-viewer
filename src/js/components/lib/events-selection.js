import React, { Component } from 'react';
import { Checkbox } from './checkbox';


export class EventsSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvents: [],
      listenToAllEvents: true,
    }
  }

  render() {
    return this.renderEventsSelection();
  }

  renderEventsSelection() {
    const { abi } = this.props;
    const { selectedEvents, listenToAllEvents } = this.state;
    if (!abi || abi.length === 0) {
      return <p className="f8">No Events found...</p>;
    }
    return (<div>
      <form className="mb4">
        <fieldset id="events" className={`bn pa0 ml0 ${listenToAllEvents ? 'o-10 pointer-none' : ''}`}>
          <p className="f8 lh-copy mb2">Select contract events:</p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {
              abi
                .filter(topics => topics.type === 'event')
                .map(event => {
                  return (<Checkbox
                    label={event.name}
                    key={event.name}
                    toggle={() => this.toggleFromEvents(event.name)}
                    isActive={selectedEvents.some(eventName => eventName === event.name)}/>)
                })
            }
          </div>
        </fieldset>
      </form>
      <Checkbox
        label={'Listen to all events'}
        toggle={() => this.toggleEventListDisabled()}
        isActive={listenToAllEvents}/>
    </div>);
  }

  toggleEventListDisabled() {
    this.setState({ listenToAllEvents: !this.state.listenToAllEvents }, this.toggleEventChanged);
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
      // remove
      this.setState({
        selectedEvents: selectedEvents.filter(event => event !== eventName),
      }, this.toggleEventChanged);
    } else {
      // add
      this.getEventStructureByName(eventName);
      this.setState({
        selectedEvents: [...selectedEvents, eventName],
      }, this.toggleEventChanged);
    }
  }

  // example: "ChangedKeys(uint32,bytes32,bytes32,uint32,uint32)"
  getEventStructureByName(eventName) {
    const { abi } = this.props;
    const event = abi.find(event => event.name === eventName);
    const inputTypes = event.inputs.map(input => input.type);
    const reducer = (acc, currentValue) => {
      if(!acc) {
        acc = currentValue;
      } else {
        acc = acc + ',' + currentValue;
      }
      return acc;
    };
    const reducedInputTypes = inputTypes.reduce(reducer, '');
    return `${event.name}(${reducedInputTypes})`;
  }

  toggleEventChanged() {
    if (this.props.onEventsChanged) {
      if(this.state.listenToAllEvents) {
        this.props.onEventsChanged([]);
      } else {
        const structuredEvents = this.state.selectedEvents
          .map(eventName => this.getEventStructureByName(eventName));
        this.props.onEventsChanged(structuredEvents);
      }
    }
  }
}
