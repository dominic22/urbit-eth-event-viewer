/-  ew-sur=eth-watcher, *eth-event-viewer
/+  *server, default-agent, dbug, ew-lib=eth-watcher, eev=eth-event-viewer
/=  index
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/eth-event-viewer/index
  /|  /html/
      /~  ~
  ==
/=  tile-js
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/eth-event-viewer/js/tile
  /|  /js/
      /~  ~
  ==
/=  script
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/eth-event-viewer/js/index
  /|  /js/
      /~  ~
  ==
/=  style
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/eth-event-viewer/css/index
  /|  /css/
      /~  ~
  ==
/=  eth-event-viewer-png
  /^  (map knot @)
  /:  /===/app/eth-event-viewer/img  /_  /png/
=,  format
::
|%
+$  card  card:agent:gall
::
+$  versioned-state
  $%  state-zero
  ==
::
+$  state-zero  [%0 contracts=contracts-type]
::
--
=|  state-zero
=*  state  -
^-  agent:gall
=<
  |_  bol=bowl:gall
  +*  this       .
      eth-event-viewer-core  +>
      cc         ~(. eth-event-viewer-core bol)
      def        ~(. (default-agent this %|) bol)
  ::
  ++  on-init
    ^-  (quip card _this)
    =/  eev  /eth-event-viewer
    =/  tile-js  '/~eth-event-viewer/js/tile.js'
    =/  launcha  [%launch-action !>([%add %eth-event-viewer / tile-js])]
    :_  this
    :~  [%pass eev %agent [our.bol %eth-event-viewer] %watch eev]
        [%pass / %arvo %e %connect [~ /'~eth-event-viewer'] %eth-event-viewer]
        [%pass eev %agent [our.bol %launch] %poke launcha]
    ==
::
  ++  on-save  !>(state)
  ++  on-load
    |=  old=vase
   `this(state !<(state-zero old))
::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    ?>  (team:title our.bol src.bol)
    =^  cards  state
      ?+    mark  (on-poke:def mark vase)
          %json
        (poke-action:cc (json-to-view-action:eev !<(json vase)))
          %eth-event-viewer
        (poke-action:cc !<(eth-event-viewer-action vase))
          %handle-http-request
        =+  !<([eyre-id=@ta =inbound-request:eyre] vase)
        ^-  (quip card _state)
        :_  state
        %+  give-simple-payload:app  eyre-id
        %+  require-authorization:app  inbound-request
        poke-handle-http-request:cc
      ==
    [cards this]
::
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    ?:  ?=([%http-response *] path)
      [~ this]
    ?:  =(/primary path)
      [[%give %fact ~ %json !>(*json)]~ this]
    ?:  =(/state/update path)
      =^  cards  state
        :_  state
        [%give %fact [/state/update ~] %json !>((contracts-json state))]~
      [cards this]
    (on-watch:def path)
::
  ++  on-leave  on-leave:def
  ++  on-peek   on-peek:def
  ++  on-fail   on-fail:def
::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    ?.  ?=(%fact -.sign)
    (on-agent:def wire sign)
    ?.  ?=(%eth-watcher-diff p.cage.sign)
    ~&  'no eth-watcher-diff received'
    (on-agent:def wire sign)
    =+  !<(diff=diff:ew-sur q.cage.sign)
    ?-  -.diff
    %history  =^  cards  state
                (event-logs-card loglist.diff)
              [cards this]
    %log      =^  cards  state
                (event-log-card event-log.diff)
              [cards this]
    %disavow  ~&  %disavow-unimplemented
              [~ this]
    ==
::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card _this)
    ?:  ?=(%bound +<.sign-arvo)
      [~ this]
    ?:  ?=(%http-response +<.sign-arvo)
      =^  cards  state
        ?>  ?=([%abi-res ~] wire)
        (http-response:cc wire client-response.sign-arvo)
      [cards this]
    (on-arvo:def wire sign-arvo)
  --
::
|_  bol=bowl:gall
::
++  poke-handle-http-request
  |=  =inbound-request:eyre
  ^-  simple-payload:http
  =+  url=(parse-request-line url.request.inbound-request)
  ?+  site.url  not-found:gen
      [%'~eth-event-viewer' %css %index ~]  (css-response:gen style)
      [%'~eth-event-viewer' %js %tile ~]    (js-response:gen tile-js)
      [%'~eth-event-viewer' %js %index ~]   (js-response:gen script)
  ::
      [%'~eth-event-viewer' %img @t *]
    =/  name=@t  i.t.t.site.url
    =/  img  (~(get by eth-event-viewer-png) name)
    ?~  img
      not-found:gen
    (png-response:gen (as-octs:mimes:html u.img))
  ::
      [%'~eth-event-viewer' *]  (html-response:gen index)
  ==
::
++  http-response
  |=  [=wire response=client-response:iris]
  ^-  (quip card _state)
  =,  dejs:format
  ?.  ?=(%finished -.response)
    ~&  'unfinished response'
    [~ state]
  =/  data=(unit mime-data:iris)  full-file.response
  ?~  data
    ~&  'data is null'
    [~ state]
  =/  ujon=(unit json)
    (de-json:html q.data.u.data)
  ?~  ujon
     [~ state]
  ?>  ?=(%o -.u.ujon)
  ?:  (gth 200 status-code.response-header.response)
    [~ state]
  =/  jon=json
    %-  pairs:enjs:format
      :~
        abi-result+(~(got by p.u.ujon) 'result')
      ==
  :_  state
  [%give %fact ~[/state/update] %json !>(jon)]~
::
++  poke-action
  |=  action=eth-event-viewer-action
  ^-  (quip card _state)
  ?-  -.action
      %add-contract  (handle-add-contract action)
      %get-abi  (handle-get-abi action)
      %remove-contract  (handle-remove-contract action)
      %reload-events  (handle-reload-events action)
  ==
::
++  handle-reload-events
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ?>  ?=(%reload-events -.act)
  :_  state
  :~  (leave-eth-watcher address.act)
      (watch-eth-watcher address.act)
  ==
::
++  handle-get-abi
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ?>  ?=(%get-abi -.act)
  :_  state
  [(request-ethereum-abi address.act) ~]
::
++  handle-add-contract
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ?>  ?=(%add-contract -.act)
  ?:  =(%.y (~(has by contracts.state) address.contract.act))
      [~ state]
  =/  address=address:ethereum  address.contract.act
  :_  state(contracts (~(put by contracts.state) address contract.act))
  :~  (request-ethereum-abi address.contract.act)
      [%give %fact [/state/update ~] %json !>((new-json contract.act))]
      (setup-eth-watcher contract.act)
      (watch-eth-watcher address.contract.act)
  ==
::
++  handle-remove-contract
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ?>  ?=(%remove-contract -.act)
  :_  state(contracts (~(del by contracts.state) address.act))
  :~  [%give %fact [/state/update ~] %json !>((remove-json address.act))]
      (leave-eth-watcher address.act)
      (clear-eth-watcher address.act)
  ==
::
++  new-json
  |=  new-contract=contract-type
  ^-  json
  =,  enjs:format
  %-  pairs
  [%new-contract (contract-encoder new-contract)]~
::
++  remove-json
  |=  address=address:ethereum
  ^-  json
  =,  enjs:format
  %-  pairs
  :~  [%remove-contract (tape (trip (ux-to-cord address)))]
  ==
::
++  contracts-json
  |=  =_state
  ^-  json
  =,  enjs:format
  %-  pairs
  :~  [%contracts (contracts-encoder state)]
  ==
::
++  contracts-encoder
  |=  =_state
  ^-  json
  =,  enjs:format
  =/  contract-list=(list contract-type)
    `(list contract-type)`~(val by contracts.state)
  `json`a+(turn contract-list contract-list-encoder)
::
++  contract-list-encoder  |=(=contract-type (contract-encoder contract-type))
::
++  contract-encoder
  |=  =contract-type
  ^-  json
  =,  enjs:format
  %-  pairs
  :~  [%address (tape (trip (ux-to-cord address.contract-type)))]
      [%name (tape (trip name.contract-type))]
      [%block-number (numb block-number.contract-type)]
      [%abi-events (tape (trip abi-events.contract-type))]
      [%specific-events `json`a+(turn `wain`specific-events.contract-type |=(=cord s+cord))]
      [%event-logs (event-logs-encoder:enjs:ew-lib event-logs.contract-type)]
  ==
::
++  event-logs-card
  |=  event-logs=loglist:ew-sur
  ^-  (quip card _state)
  ?~  event-logs
    [~ state]
  =/  address=address:ethereum
    address:(snag 0 `loglist:ew-sur`event-logs)
  =/  contract=contract-type
    (~(got by contracts.state) address)
  =/  updated-contract=contract-type
    contract(event-logs event-logs)
  =/  filtered-contracts=contracts-type
    (~(del by contracts.state) address)
  =/  new-contracts=contracts-type
    (~(put by filtered-contracts) address updated-contract)
  :_  state(contracts new-contracts)
  [%give %fact [/state/update ~] %json !>((history:dejs:ew-lib event-logs))]~
::
++  event-log-card
  |=  =event-log:rpc:ethereum
  ^-  (quip card _state)
  =/  address=address:ethereum
    address.event-log
  =/  contract=contract-type
    (~(got by contracts.state) address)
  =/  updated-contract=contract-type
    contract(event-logs (weld (flop event-logs.contract) [event-log ~]))
  =/  filtered-contracts=contracts-type
    (~(del by contracts.state) address)
  =/  new-contracts=contracts-type
    (~(put by filtered-contracts) address updated-contract)
  :_  state(contracts new-contracts)
  [%give %fact [/state/update ~] %json !>((event-log:dejs:ew-lib event-log))]~
::
++  request-ethereum-abi
  |=  address=address:ethereum
  ^-  card:agent:gall
  =/  req=request:http
    (get-request (ux-to-cord address))
  [%pass /abi-res %arvo %i %request req *outbound-config:iris]
::
++  get-request
  |=  address=@t
  ^-  request:http
  =/  base=@t
    'https://api.etherscan.io/api?module=contract&action=getabi&address='
  =/  url=@t  (cat 3 base address)
  =/  hed  [['Accept' 'application/json']]~
  [%'GET' url hed *(unit octs)]
::
++  setup-eth-watcher
  |=  contract=contract-type
  =/  url=@t  'http://eth-mainnet.urbit.org:8545'
  %+  to-eth-watcher  (get-path address.contract)
  :+  %poke   %eth-watcher-poke
  !>  ^-  poke:ew-sur
  :+  %watch  (get-path address.contract)
  :*  url
      |
      ~m2
      ~m10
      block-number.contract
      ~[address.contract]
      (get-topics specific-events.contract)
  ==
::
++  watch-eth-watcher
  |=  address=address:ethereum
  %+  to-eth-watcher  (get-path address)
  [%watch (get-logs-path address)]
::
++  leave-eth-watcher
  |=  address=address:ethereum
  %+  to-eth-watcher  (get-path address)
  [%leave ~]
::
++  clear-eth-watcher
  |=  address=address:ethereum
  %+  to-eth-watcher  /clear
  :+  %poke  %eth-watcher-poke
  !>  ^-  poke:ew-sur
  [%clear (get-path address)]
::
++  get-topics
  |=  specific-events=(list @t)
  ^-  (list ?(address:ethereum (list address:ethereum)))
  ?~  specific-events
    ~
  :~  `(list address:ethereum)`(turn specific-events hex-list)
  ==
::
++  to-eth-watcher
  |=  [=wire =task:agent:gall]
  ^-  card
  [%pass wire %agent [our.bol %eth-watcher] task]
::
++  hex-list  |=(e=@t `address:ethereum`(event-string-to-hex (trip e)))
::
++  event-string-to-hex
  |=  event-string=tape
  ^-  address:ethereum
  `address:ethereum`(keccak-256:keccak:crypto (as-octt:mimes:html event-string))
::
++  get-path
  |=  address=address:ethereum
  ^-  path
  `path`/[dap.bol]/(scot %tas (ux-to-cord address))
::
++  get-logs-path
  |=  address=address:ethereum
  ^-  path
  `path`/logs/[dap.bol]/(scot %tas (ux-to-cord address))
::
++  contract-cord-to-hex
  |=  address=@t
  ^-  address:ethereum
  =/  address-tape=tape
    (cass q:(trim 2 (trip address)))
  `address:ethereum`(scan address-tape hex)
::
++  ux-to-cord
  |=  address=address:ethereum
  ^-  @t
::  crip transforms tape to cord
  (cat 3 '0x' (crip ((x-co:co 4) address)))
::
--
