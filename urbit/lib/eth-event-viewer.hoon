/-  *eth-event-viewer
=,  ethereum-types
|%
::
++  json-to-view-action
  |=  jon=json
  ^-  eth-event-viewer-action
  =,  dejs:format
  =<  (parse-json jon)
  |%
  ++  parse-json
    %-  of
    :~  [%add-contract parse-contract]
        [%get-abi parse-cord]
        [%remove-contract parse-cord]
        [%reload-events parse-cord]
    ==
::
  ++  parse-cord
    (ot address+parse-hex-result:rpc:ethereum ~)
::
  ++  parse-contract
    %-  ot
    :~  [%address parse-hex-result:rpc:ethereum]
        [%name so]
        [%block-number ni]
        [%specific-events (ar so)]
        [%abi-events so]
        [%event-logs ul]
    ==
::
  --
::
--
