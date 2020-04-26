/-  ew-sur=eth-watcher
/+  *server, default-agent, dbug, ew-lib=eth-watcher
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
      event-logs=loglist:ew-sur
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
    =/  eev  /etheventviewer
    =/  tile-js  '/~etheventviewer/js/tile.js'
    =/  launcha  [%launch-action !>([%etheventviewer / tile-js])]
    :_  this
    :~  [%pass eev %agent [our.bol %etheventviewer] %watch eev]
        [%pass / %arvo %e %connect [~ /'~etheventviewer'] %etheventviewer]
        [%pass eev %agent [our.bol %launch] %poke launcha]
    ==
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
  --
::
|_  bol=bowl:gall
::
++  event-logs-card
  |=  event-logs=loglist:ew-sur
  ^-  (quip card _state)
  ?~  event-logs
    [~ state]
  =/  address
    address:`event-log:rpc:ethereum`+2:event-logs
  =/  contract
    (~(got by contracts.state) address)
  =/  updated-contract
    contract(event-logs event-logs)
  =/  filtered-contracts
    (~(del by contracts.state) address)
  =/  new-contracts
    (~(put by filtered-contracts) address updated-contract)
  :_  state(contracts new-contracts)
  [%give %fact [/state/update ~] %json !>((history-json:ew-lib event-logs))]~
::
++  event-log-card
  |=  =event-log:rpc:ethereum
  ^-  (quip card _state)
  =/  address
    address.event-log
  =/  contract
    (~(got by contracts.state) address)
  =/  updated-contract
    contract(event-logs (weld (flop event-logs.contract) [event-log ~]))
  =/  filtered-contracts
    (~(del by contracts.state) address)
  =/  new-contracts
    (~(put by filtered-contracts) address updated-contract)
  :_  state(contracts new-contracts)
  [%give %fact [/state/update ~] %json !>((event-log-json:ew-lib event-log))]~
::
++  request-ethereum-abi
  |=  address=@ux
  ^-  card:agent:gall
  =/  req=request:http
    (get-request (ux-to-cord address))
  [%pass /etheventviewer/abi-res %arvo %i %request req *outbound-config:iris]
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
  %+  to-eth-watcher  (get-path address.contract)
  :+  %poke   %eth-watcher-poke
  !>  ^-  poke:ew-sur
  :+  %watch  (get-path address.contract)
  :*  url
      |
      ~m2
      ~m2
      9.920.593
      ~[address.contract]
      (get-topics specific-events.contract)
  ==
::
++  watch-eth-watcher
  |=  address=@ux
  %+  to-eth-watcher  (get-path address)
  [%watch (get-logs-path address)]
::
++  leave-eth-watcher
  |=  address=@ux
  %+  to-eth-watcher  (get-path address)
  [%leave ~]
::
++  clear-eth-watcher
  |=  address=@ux
  %+  to-eth-watcher  /clear
  :+  %poke  %eth-watcher-poke
  !>  ^-  poke:ew-sur
  [%clear (get-path address)]
::
++  get-topics
  |=  specific-events=(list @t)
  ^-  (list ?(@ux (list @ux)))
  ?~  specific-events
    ~
  :~  `(list @ux)`(turn specific-events hex-list)
  ==
::
++  hex-list  |=(e=@t `@ux`(event-string-to-hex (trip e)))
::
++  event-string-to-hex
  |=  event-string=tape
  ^-  @ux
  `@ux`(keccak-256:keccak:crypto (as-octt:mimes:html event-string))
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
  =/  address-tape
    (cass q:(trim 2 (trip address)))
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
  =/  address  address.contract.act
  :_  state(contracts (~(put by contracts.state) address contract.act))
  :~  (request-ethereum-abi address.contract.act)
      [%give %fact [/state/update ~] %json !>((new-json contract.act))]
      (setup-eth-watcher contract.act)
      (watch-eth-watcher address.contract.act)
  ==
::
++  new-json
  |=  new-contract=contract-type
  ^-  json
  =,  enjs:format
  %-  pairs
  [%new-contract (contract-encoder new-contract)]~
  
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
++  remove-json
  |=  address=@ux
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
  =/  contract-list
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
      [%abi-events (tape (trip abi-events.contract-type))]
      [%specific-events `json`a+(turn `wain`specific-events.contract-type |=(=cord s+cord))]
      [%event-logs (event-logs-encoder:ew-lib event-logs.contract-type)]
  ==
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
--
