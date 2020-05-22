/-  eth-watcher
=,  ethereum-types
|%
++  dejs  |%
::
  ++  event-log
    |=  =event-log:rpc:ethereum
    ^-  json
    =,  enjs:format
    %-  pairs
    :~  [%event-log (event-log-encoder:enjs event-log)]
    ==
::
  ++  history
    |=  event-logs=loglist:eth-watcher
    ^-  json
    =,  enjs:format
    %-  pairs
    :~  [%history (event-logs-encoder:enjs event-logs)]
    ==
::
--
::
++  enjs  |%
::
  ++  event-logs-encoder
    |=  event-logs=loglist:eth-watcher
    =,  enjs:format
    ^-  json
    ?~  event-logs
      ~
    `json`a+(turn event-logs |=(=event-log:rpc:ethereum (event-log-encoder event-log)))
::
  ++  event-log-encoder
    |=  =event-log:rpc:ethereum
    ^-  json
    =,  abi:ethereum
    =,  enjs:format
    %-  pairs
    :~  [%address (tape (trip (ux-to-cord address.event-log)))]
        [%data (tape (trip data.event-log))]
        [%topics `json`a+(turn topics.event-log |=(addr=address:ethereum (tape (trip (ux-to-cord addr)))))]
        [%mined (mined-encoder event-log)]
    ==
::
  ++  mined-encoder
    |=  =event-log:rpc:ethereum
    ^-  json
    =,  abi:ethereum
    =,  enjs:format
    =/  mined  (need mined.event-log)
    %-  pairs
    :~  [%log-index (numb log-index:mined)]
        [%transaction-index (numb transaction-index:mined)]
        [%transaction-hash (tape (trip (ux-to-cord transaction-hash:mined)))]
        [%block-number (numb block-number:mined)]
        [%block-hash (tape (trip (ux-to-cord block-hash:mined)))]
    ==
::
  --
++  ux-to-cord
  |=  address=address:ethereum
  ^-  @t
::  crip transforms tape to cord
  (cat 3 '0x' (crip ((x-co:co 4) address)))
--
