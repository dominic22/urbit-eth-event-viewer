
export function getEventStructureByName(abi, eventName) {
  const event = abi.find(event => event.name === eventName);
  reduceToEventDefinition(event);
}

// example: "ChangedKeys(uint32,bytes32,bytes32,uint32,uint32)"
function reduceToEventDefinition(event) {
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
