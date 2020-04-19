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
::
+$  eth-event-viewer-action
  $%  [%add-contract contract=contract-type]
      [%get-abi address=@ux]
      [%remove-contract address=@ux]
      [%reload-events address=@ux]
  ==
::
+$  contract-type
  $:  address=@ux
      name=@t
      specific-events=(list @t)
      abi-events=@t
      event-logs=loglist:eth-watcher
  ==

+$  versioned-state
  $%  state-zero
  ==
+$  state-zero  [%0 contracts=(map @ux contract-type)]
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
  ^-  (quip card _this)
  ~&  '%on-agent'
  ~&  wire
  ?.  ?=(%fact -.sign)
    ~&  'no fact received'
    (on-agent:def wire sign)
  ?.  ?=(%eth-watcher-diff p.cage.sign)
    ~&  'no eth-watcher-diff received'
    (on-agent:def wire sign)
  ~&  '%eth-watcher-diff'
  =+  !<(diff=diff:eth-watcher q.cage.sign)
  ?-  -.diff
    %history  ~&  [%got-history (lent loglist.diff)]
              =^  cards  state
                (event-logs-card loglist.diff)
              [cards this]
::              [[%give %fact [/state/update ~] %json !>((event-logs-to-json loglist.diff))]~ state]
    %log      ~&  %got-log
              =^  cards  state
                (add-event-log-to-state event-log.diff)
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
      =^  cards  state
        [[%give %fact [/state/update ~] %json !>((make-tile-json state))]~ state]
      [cards this]
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
++  event-logs-card
  |=  event-logs=loglist:eth-watcher
  ^-  (quip card _state)
  ~&  '%event-logs-card'
  ?~  event-logs
    ~&  'history is null'
    [~ state]
  =/  address  address:`event-log:rpc:ethereum`+2:event-logs
  =/  contract  (~(got by contracts.state) address)
::  =/  updated-contract  contract(event-logs (weld (flop event-logs.contract) event-logs))
  =/  updated-contract  contract(event-logs event-logs)
  =/  filtered-contracts  (~(del by contracts.state) address)
  =/  new-contracts  (~(put by filtered-contracts) address updated-contract)
  [[%give %fact [/state/update ~] %json !>((make-history-json event-logs))]~ state(contracts new-contracts)]
::
++  add-event-log-to-state
  |=  =event-log:rpc:ethereum
  ^-  (quip card _state)
  ~&  '%add-event-log-to-state'
  =/  address  address.event-log
  =/  contract  (~(got by contracts.state) address)
  =/  updated-contract  contract(event-logs (weld (flop event-logs.contract) [event-log ~]))
  =/  filtered-contracts  (~(del by contracts.state) address)
  =/  new-contracts  (~(put by filtered-contracts) address updated-contract)
  [[%give %fact [/state/update ~] %json !>((make-event-log-json event-log))]~ state(contracts new-contracts)]
::
++  make-event-log-json
  |=  =event-log:rpc:ethereum
  ^-  json
  ~&  '%make-event-log-json'
  =,  enjs:format
  %-  pairs
  :~  [%event-log (event-log-encoder event-log)]
  ==
::
++  make-history-json
  |=  event-logs=loglist:eth-watcher
  ^-  json
  ~&  '%make-history-json'
  =,  enjs:format
  %-  pairs
  :~  [%history (event-logs-to-json event-logs)]
  ==
::
++  event-logs-to-json
  |=  event-logs=loglist:eth-watcher
  ~&  '%event-logs-to-json'
  =,  enjs:format
  ^-  json
  ?~  event-logs
    ~&  'event-logs are null'
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
      [%topics `json`a+(turn topics.event-log |=(addr=@ux (tape (trip (ux-to-cord addr)))))]
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
++  transform-event-string-to-hex
  |=  event-string=tape
  ^-  @ux
  `@ux`(keccak-256:keccak:crypto (as-octt:mimes:html event-string))
::
++  request-ethereum-abi
  |=  address=@ux
  ^-  card:agent:gall
  ~&  '%request-ethereum-abi'
  =/  req=request:http  (get-request (ux-to-cord address))
  [%pass /etheventviewer/ethereum-abi-response %arvo %i %request req *outbound-config:iris]
::
++  ux-to-cord
  |=  address=@ux
  ^-  @t
::  crip transforms tape to cord
  (cat 3 '0x' (crip ((x-co:co 4) address)))
::
++  to-eth-watcher
  |=  [=wire =task:agent:gall]
  ^-  card
  [%pass wire %agent [our.bol %eth-watcher] task]
::
++  setup-eth-watcher
  |=  contract=contract-type
  =/  url  'http://eth-mainnet.urbit.org:8545'
  ~&  '%setup eth-watcher for path:'
  ~&  (get-path address.contract)
  ~&  'TOPICS: '
  ~&  (get-topics specific-events.contract)
  %+  to-eth-watcher  (get-path address.contract)
  :+  %poke   %eth-watcher-poke
  !>  ^-  poke:eth-watcher
  :+  %watch  (get-path address.contract)
  :*  url
      |
      ~m1
      9.899.017
      ~[address.contract]
      (get-topics specific-events.contract)
  ==
::
++  get-topics
  |=  specific-events=(list @t)
  ^-  (list ?(@ux (list @ux)))
  ?~  specific-events
    ~&  'no specific events'
    ~
  :~  `(list @ux)`(turn specific-events |=(e=@t `@ux`(transform-event-string-to-hex (trip e))))
  ==
::
++  get-path
  |=  address=@ux
  ^-  path
  `path`/[dap.bol]/(scot %tas (ux-to-cord address))
::
++  get-logs-path
  |=  address=@ux
  ^-  path
  `path`/logs/[dap.bol]/(scot %tas (ux-to-cord address))
::
++  watch-eth-watcher
  |=  address=@ux
  ~&  'watch eth watcher'
  %+  to-eth-watcher  (get-path address)
  [%watch (get-logs-path address)]
::
++  leave-eth-watcher
  |=  address=@ux
  ~&  'leave eth watcher'
  %+  to-eth-watcher  (get-path address)
  [%leave ~]
::
++  clear-eth-watcher
  |=  address=@ux
  %+  to-eth-watcher  /clear
  :+  %poke  %eth-watcher-poke
  !>  ^-  poke:eth-watcher
  [%clear (get-path address)]
::
++  json-to-action
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
        [%specific-events (ar so)]
        [%abi-events so]
        [%event-logs ul]
    ==
::
  --
::
++  contract-cord-to-hex
  |=  address=@t
  ^-  @ux
  =/  address-tape  (cass q:(trim 2 (trip address)))
  `@ux`(scan address-tape hex)
::
++  poke-action-name
  |=  jon=json
  ^-  (quip card _state)
  (poke-action (json-to-action jon))
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
  ~&  '%handle-reload-events'
  ?>  ?=(%reload-events -.act)
  ~&  address.act
  :_  state
  :~  (leave-eth-watcher address.act)
      (watch-eth-watcher address.act)
  ==
::
++  handle-get-abi
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-get-abi'
  ?>  ?=(%get-abi -.act)
  :-  [(request-ethereum-abi address.act) ~]
  state
::
++  handle-add-contract
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-add-contract'
  ~&  act
  ?>  ?=(%add-contract -.act)
  :_  state(contracts (~(put by contracts.state) address.contract.act contract.act))
  :~  (request-ethereum-abi address.contract.act)
      [%give %fact [/state/update ~] %json !>((make-new-contract-json contract.act))]
      (setup-eth-watcher contract.act)
::    reload events from history as well
::      (leave-eth-watcher address.contract.act)
::      (watch-eth-watcher address.contract.act)
  ==
::
++  make-new-contract-json
  |=  new-contract=contract-type
  ^-  json
  ~&  '%make-new-contract-json'
  =,  enjs:format
  %-  pairs
  :~  [%new-contract (contract-encoder new-contract)]
  ==
::
++  handle-remove-contract
  |=  act=eth-event-viewer-action
  ^-  (quip card _state)
  ~&  '%handle-remove-contract'
  ~&  act
  ?>  ?=(%remove-contract -.act)
  :_  state(contracts (~(del by contracts.state) address.act))
  :~  [%give %fact [/state/update ~] %json !>((make-remove-contract-json address.act))]
      (leave-eth-watcher address.act)
      (clear-eth-watcher address.act)
  ==
::
++  make-remove-contract-json
  |=  address=@ux
  ^-  json
  ~&  'make-remove-contract-json'
  =,  enjs:format
  %-  pairs
  :~  [%remove-contract (tape (trip (ux-to-cord address)))]
  ==
::
++  make-tile-json
  |=  =_state
  ^-  json
  ~&  'make tile json'
  =,  enjs:format
  %-  pairs
  :~  [%contracts (contracts-encoder state)]
  ==
::
++  contracts-encoder
  |=  =_state
  ^-  json
  =,  enjs:format
  =/  contract-type-list  `(list contract-type)`~(val by contracts.state)
  `json`a+(turn contract-type-list |=(=contract-type (contract-encoder contract-type)))
::
++  contract-encoder
  |=  =contract-type
  ^-  json
  =,  enjs:format
  %-  pairs
  :~  [%address (tape (trip (ux-to-cord address.contract-type)))]
      [%name (tape (trip name.contract-type))]
      [%abi-events (tape (trip abi-events.contract-type))]
      [%specific-events `json`a+(turn `wain`specific-events.contract-type |=(=cord s+cord))]
      [%event-logs (event-logs-to-json event-logs.contract-type)]
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
  =,  dejs:format
  ::  ignore all but %finished
  ?.  ?=(%finished -.response)
    ~&  'unfinished response'
    [~ state]
    =/  data=(unit mime-data:iris)  full-file.response
  ?~  data
    ~&  'data is null'
    [~ state]
  =/  ujon=(unit json)  (de-json:html q.data.u.data)
  ?~  ujon
     [~ state]
  ?>  ?=(%o -.u.ujon)
  ?:  (gth 200 status-code.response-header.response)
    [~ state]
  =/  jon=json  %-  pairs:enjs:format  :~
    abi-result+(~(got by p.u.ujon) 'result')
  ==
  :-  [%give %fact ~[/state/update] %json !>(jon)]~
  state
::
--
