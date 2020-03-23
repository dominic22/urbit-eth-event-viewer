/-  eth-watcher
/+  *server, default-agent
/=  index
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/etheventviewer/index
  /|  /html/
      /~  ~
  ==
/=  tile-js
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/etheventviewer/js/tile
  /|  /js/
      /~  ~
  ==
/=  script
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/etheventviewer/js/index
  /|  /js/
      /~  ~
  ==
/=  style
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/etheventviewer/css/index
  /|  /css/
      /~  ~
  ==
/=  etheventviewer-png
  /^  (map knot @)
  /:  /===/app/etheventviewer/img  /_  /png/
=,  format
::
|%
+$  card  card:agent:gall

+$  eth-event-viewer-action
  $%  [%create contract=@t]
      [%add-contract contract=contract-type]
      [%get-contract-events contract=@t]
      [%remove-contract contract=contract-type]
      [%subscribe contract=@t]
      [%unsubscribe contract=@t]
  ==
::
+$  contract-type
  $:  address=@t
      name=@t
      specific-events=(list @t)
  ==

+$  versioned-state
  $%  state-zero
  ==
+$  state-zero  [%0 data=json contracts=(set contract-type)]
--
=|  state-zero
=*  state  -
^-  agent:gall
=<
  |_  bol=bowl:gall
  +*  this       .
      etheventviewer-core  +>
      cc         ~(. etheventviewer-core bol)
      def        ~(. (default-agent this %|) bol)
  ::
  ++  on-init
    ^-  (quip card _this)
    =/  launcha  [%launch-action !>([%etheventviewer / '/~etheventviewer/js/tile.js'])]
    :_  this
    :~  [%pass /etheventviewer %agent [our.bol %etheventviewer] %watch /etheventviewer]
        [%pass / %arvo %e %connect [~ /'~etheventviewer'] %etheventviewer]
        [%pass /etheventviewer %agent [our.bol %launch] %poke launcha]
    ==
::
  ++  on-agent
  |=  [=wire =sign:agent:gall]
  ~&  '%on-agent'
  ~&  wire
  ~&  -.sign
  ?.  ?=([%eth-watcher ~] wire)
    (on-agent:def wire sign)
  ~&  '%eth-watcher found'
  ?.  ?=(%fact -.sign)
    (on-agent:def wire sign)
  ~&  '%fact found'
  ?.  ?=(%eth-watcher-diff p.cage.sign)
    (on-agent:def wire sign)
  ~&  '%eth-watcher-diff'
  =+  !<(diff=diff:eth-watcher q.cage.sign)
  ~&  'return fact eth-watcher-update to landscape'
  :-  [%give %fact ~[/etheventviewer/eth-watcher-update] %json !>((make-tile-json state))]~
  this
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card _this)
    ~&  '%on-arvo'
    ?:  ?=(%bound +<.sign-arvo)
      [~ this]
    ~&  '%after bound'
    ?:  ?=(%http-response +<.sign-arvo)
      =^  cards  state
        (http-response:cc wire client-response.sign-arvo)
      [cards this]
    (on-arvo:def wire sign-arvo)
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
        (poke-action-name:cc !<(json vase))
          %handle-http-request
        =+  !<([eyre-id=@ta =inbound-request:eyre] vase)
        :: construct a cell but inverted => [card state]
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
      [[%give %fact ~ %json !>(*json)]~ this]
    (on-watch:def path)

  ::
  ++  on-leave  on-leave:def
  ++  on-peek   on-peek:def
  ++  on-fail   on-fail:def
  --
::
|_  bol=bowl:gall
::
++  get-request
  |=  address=@t
  ^-  request:http
  ~&  '%get-request with address:'
  ~&  address
  =/  base=@t  'https://api.etherscan.io/api?module=contract&action=getabi&address='
  =/  url=@t  (cat 3 base address)
  =/  hed  [['Accept' 'application/json']]~
  [%'GET' url hed *(unit octs)]
::
++  request-ethereum-abi
  |=  address=@t
  ^-  card:agent:gall
  ~&  '%request-ethereum-abi'
  =/  req=request:http  (get-request address)
  [%pass /etheventviewer/ethereum-abi-response %arvo %i %request req *outbound-config:iris]
::
++  subscribe
  |=  contract=@ux
  ^-  card:agent:gall
  ~&  '%subscribe'
  =/  url  'https://api.etherscan.io/api?module=logs&action=getLogs'
  =/  path  /etheventviewer/eth-watcher-update
  =/  topics  ~
  =/  args=vase  !>
    :*  %watch  path
        url
        %.n
        ~s10
        launch:contracts:azimuth
        ~[contract]
        topics
    ==
  [%pass path %agent [our.bol %eth-watcher] %poke %eth-watcher-poke args]
::
++  unsubscribe
  |=  contract=@t
  ^-  card:agent:gall
  ~&  '%unsubscribe'
  =/  path  /etheventviewer/eth-watcher-update
  =/  args  !>([%clear path])
  [%pass path %agent [our.bol %eth-watcher] %poke %eth-watcher-poke args]
::
++  json-to-action
  |=  jon=json
  ^-  eth-event-viewer-action
  =,  dejs:format
  =<  (parse-json jon)
  |%
  ++  parse-json
    %-  of
    :~  [%create parse-cord]
        [%add-contract parse-contract]
        [%get-contract-events parse-cord]
        [%remove-contract parse-contract]
        [%subscribe parse-cord]
        [%unsubscribe parse-cord]
    ==
::
  ++  parse-cord
    (ot contract+so ~)
::
  ++  parse-contract
    %-  ot
    :~  [%address so]
        [%name so]
        [%specific-events (ar so)]
    ==
::
  --
::
++  contract-cord-to-hex
  |=  contract=@t
  ^-  @ux
  =/  contract-tape  (cass q:(trim 2 (trip contract)))
  `@ux`(scan contract-tape hex)
::
++  poke-action-name
  |=  jon=json
  ^-  (quip card _state)
  (poke-action (json-to-action jon))
::
++  poke-action
  |=  action=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%poke-action'
  ?-  -.action
      %create    (handle-create action)
      %add-contract  (handle-add-contract action)
      %get-contract-events  (handle-get-contract-events action)
      %remove-contract  (handle-remove-contract action)
      %subscribe  (handle-subscribe action)
      %unsubscribe  (handle-unsubscribe action)
  ==
::
++  handle-create
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-create'
  ~&  '%contract-cord-to-hex'
  ?>  ?=(%create -.act)
  ~&  (contract-cord-to-hex contract.act)
  :-  [%give %fact [/state/update ~] %json !>((make-tile-json state))]~
  state
::
++  handle-get-contract-events
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-get-contract-events'
  ?>  ?=(%get-contract-events -.act)
  :-  [(request-ethereum-abi contract.act) ~]
  state
::
++  handle-subscribe
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-subscribe'
  ?>  ?=(%subscribe -.act)
  =/  parsed-contract  (contract-cord-to-hex contract.act)
  :-  [(subscribe parsed-contract) ~]
  state
::
++  handle-unsubscribe
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-unsubscribe'
  ?>  ?=(%unsubscribe -.act)
  :-  [(unsubscribe contract.act) ~]
  state
::
++  handle-add-contract
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-add-contract'
  ~&  act
  ?>  ?=(%add-contract -.act)
  ~&  contract.act
  =/  new-state  state(contracts (~(put in contracts.state) contract.act))
::  new:
::  (subscribe (contract-cord-to-hex contract.act))
::  :_  new-state
::  :~  (request-ethereum-abi -.act)
::      [%give %fact [/state/update ~] %json !>((make-tile-json new-state))]
::  ==
  =/  lismov  [%give %fact [/state/update ~] %json !>((make-tile-json new-state))]
  :_  new-state
  :~  (request-ethereum-abi address.contract.act)
      lismov
  ==
::
++  handle-remove-contract
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-remove-contract'
  ~&  act
  ?>  ?=(%remove-contract -.act)
  =/  new-state  state(contracts (~(del in contracts.state) contract.act))
::  new:
::  :_  new-state
::  :~  (unsubscribe (contract-cord-to-hex contract.act))
::      [%give %fact [/state/update ~] %json !>((make-tile-json new-state))]
::  ==
  :-  [%give %fact [/state/update ~] %json !>((make-tile-json new-state))]~
  new-state
::
++  make-tile-json
  |=  new-state=_state
  ^-  json
  ~&  'make tile json'
  =,  enjs:format
::  =/  contracts-list  ~(tap in contracts.new-state)
  %-  pairs
  :~  [%contracts (contracts-encoder new-state)]
::      [%contracts `json`a+(turn `wain`contracts-list |=(=cord s+cord))]
      [%data data.new-state]
  ==
::
++  contracts-encoder
  |=  new-state=_state
  ^-  json
  =,  enjs:format
  =/  contract-type-list  ~(tap in contracts.new-state)
  ~&  'contracts-list:'
  ~&  contract-type-list
  `json`a+(turn contract-type-list |=(=contract-type (contract-encoder contract-type)))
::
++  contract-encoder
  |=  =contract-type
  ^-  json
  =,  enjs:format
  %-  pairs
  :~  [%address (tape (trip address.contract-type))]
      [%name (tape (trip name.contract-type))]
      [%specific-events `json`a+(turn `wain`specific-events.contract-type |=(=cord s+cord))]
  ==
::
++  set-to-array
  |*  {a/(set) b/$-(* json)}
  ^-  json
  [%a (turn ~(tap in a) b)]
::
++  poke-handle-http-request
  |=  =inbound-request:eyre
  ^-  simple-payload:http
  =+  url=(parse-request-line url.request.inbound-request)
  ?+  site.url  not-found:gen
      [%'~etheventviewer' %css %index ~]  (css-response:gen style)
      [%'~etheventviewer' %js %tile ~]    (js-response:gen tile-js)
      [%'~etheventviewer' %js %index ~]   (js-response:gen script)
  ::
      [%'~etheventviewer' %img @t *]
    =/  name=@t  i.t.t.site.url
    =/  img  (~(get by etheventviewer-png) name)
    ?~  img
      not-found:gen
    (png-response:gen (as-octs:mimes:html u.img))
  ::
      [%'~etheventviewer' *]  (html-response:gen index)
  ==
::
++  http-response
  |=  [=wire response=client-response:iris]
  ^-  (quip card _state)
  ~&  'begin of http response with following wire:'
  ~&  wire
  ::  ignore all but %finished
  ?.  ?=(%finished -.response)
    ~&  'unfinished response'
    [~ state]
    =/  data=(unit mime-data:iris)  full-file.response
  ?~  data
    :: data is null
    ~&  'data is null'
    [~ state]
  =/  ujon=(unit json)  (de-json:html q.data.u.data)
  ?~  ujon
     [~ state]
  ?>  ?=(%o -.u.ujon)
  ?:  (gth 200 status-code.response-header.response)
    [~ state]
  ~&  'data received'
  =/  new-state  state(data (need ujon))
  :-  [%give %fact ~[/state/update] %json !>((make-tile-json new-state))]~
  state(data (need ujon))
--
