## Foundry

deploy command

```shell
forge create --rpc-url $RPC_URL --private-key $PVT_KEY Lottery --constructor-args-path ./args.json --etherscan-
api-key $API_KEY --verify
```

env.example

```javascript
RPC_URL=
PVT_KEY=
API_KEY=
```

For the contract extention

- we can use chainLink VRF too for randomness (to make it attack proof)
- also openZeppelin ownable can also be used

but kept it simple for task purpose.
