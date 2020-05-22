/-  *eth-watcher
|%
+$  contracts-type  (map address:ethereum contract-type)
+$  contract-type
  $:  address=address:ethereum
      name=@t
      block-number=@
      specific-events=(list @t)
      abi-events=@t
      event-logs=loglist
  ==
+$  eth-event-viewer-action
  $%  [%add-contract contract=contract-type]
      [%get-abi address=address:ethereum]
      [%remove-contract address=address:ethereum]
      [%reload-events address=address:ethereum]
  ==
--
