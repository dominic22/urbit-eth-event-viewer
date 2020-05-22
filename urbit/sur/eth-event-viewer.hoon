/-  *eth-watcher
|%
+$  contract-type
  $:  address=@ux
      name=@t
      block-number=@
      specific-events=(list @t)
      abi-events=@t
      event-logs=loglist
  ==
+$  eth-event-viewer-action
  $%  [%add-contract contract=contract-type]
      [%get-abi address=@ux]
      [%remove-contract address=@ux]
      [%reload-events address=@ux]
  ==
--
