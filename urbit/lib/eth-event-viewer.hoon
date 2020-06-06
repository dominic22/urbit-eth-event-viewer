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
        [%get-abi parse-address]
        [%get-block-number parse-timestamp]
        [%remove-contract parse-address]
        [%reload-events parse-address]
    ==
::
  ++  parse-address
    (ot address+parse-hex-result:rpc:ethereum ~)
::
  ++  parse-timestamp
    (ot timestamp+so ~)
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
