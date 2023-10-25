# Lastic UI

First spin up substrate, because broker pallet you have to make the substrate run this way:

```sh
git clone git@github.com:paritytech/polkadot-sdk.git
cd substrate
cargo run -p node-cli -r -- --dev
```

To run the frontend:
```sh
yarn install
yarn start
```

Go to `http://localhost:8000/substrate-front-end-template`.


### Usage

You can start the template in development mode to connect to a locally running node

```bash
yarn start
```

You can also build the app in production mode,

```bash
yarn build
```

## Deliverables

Flow chart:

[![FLOW CHART](https://github.com/LasticXYZ/LasticUI/assets/30662672/a08dd7b3-bc14-4d51-9689-75bac7895b26)](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FaFn15lyvti5hqLJBNUDZlU%2FLastic-Flow-Chart-%25231%3Ftype%3Dwhiteboard%26node-id%3D0%253A1%26t%3Dt31UcWVAme6gT0JH-1)

Figma UI:
_After Launching click Options > Fit Width_

[![FIGMA UI](https://github.com/LasticXYZ/LasticUI/assets/30662672/442e1f73-8bd9-48a2-8139-1057ec2dddd1)](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FYzHexLzhb9Q4FPkM19cl1y%2FLastic%3Fpage-id%3D0%253A1%26type%3Ddesign%26node-id%3D203-897%26viewport%3D1012%252C165%252C0.06%26t%3DFBfVL9tIBH4OQJ1A-1%26scaling%3Dmin-zoom%26starting-point-node-id%3D203%253A897%26mode%3Ddesign)


---

This project is built upon this template: `https://github.com/substrate-developer-hub/substrate-front-end-template.git`


### Try the Hosted Version

Connecting to your local Substrate node (Chrome and Firefox only):

https://substrate-developer-hub.github.io/substrate-front-end-template?rpc=ws://localhost:9944

Connecting to Polkadot:

https://substrate-developer-hub.github.io/substrate-front-end-template?rpc=wss://rpc.polkadot.io


## Configuration

The template's configuration is stored in the `src/config` directory, with
`common.json` being loaded first, then the environment-specific JSON file,
and finally environment variables, with precedence.

- `development.json` affects the development environment
- `test.json` affects the test environment, triggered in `yarn test` command.
- `production.json` affects the production environment, triggered with the `yarn build` command.

To deploy your own front-end to production, you need to configure:

- `PROVIDER_SOCKET` in `src/config/production.json` pointing to your own
  deployed node.

Some environment variables are read and integrated in the template `config` object,
including:

- `REACT_APP_PROVIDER_SOCKET` overriding `config[PROVIDER_SOCKET]`

More on [React environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables).



### How to Specify the WebSocket to Connect to

There are two ways to specify the websocket to connect to:

- With `PROVIDER_SOCKET` in `{common, development, production}.json`.
- With `rpc=<ws or wss connection>` query parameter after the URL. This overrides the above setting.

## Reusable Components

### useSubstrate Custom Hook

The custom hook `useSubstrate()` provides access to the Polkadot js API and thus the
keyring and the blockchain itself. Specifically it exposes this API.

```js
{
  setCurrentAccount: func(acct) {...}
  state: {
    socket,
    keyring,
    keyringState,
    api,
    apiState,
    currentAccount
  }
}
```

- `socket` - The remote provider socket it is connecting to.
- `keyring` - A keyring of accounts available to the user.
- `keyringState` - One of `"READY"` or `"ERROR"` states. `keyring` is valid
  only when `keyringState === "READY"`.
- `api` - The remote api to the connected node.
- `apiState` - One of `"CONNECTING"`, `"READY"`, or `"ERROR"` states. `api` is valid
  only when `apiState === "READY"`.
- `currentAccount` - The current selected account pair in the application context.
- `setCurrentAccount` - Function to update the `currentAccount` value in the application context.

If you are only interested in reading the `state`, there is a shorthand `useSubstrateState()` just to retrieve the state.

### TxButton Component

The [TxButton](./src/substrate-lib/components/TxButton.js) handles basic [query](https://polkadot.js.org/docs/api/start/api.query) and [transaction](https://polkadot.js.org/docs/api/start/api.tx) requests to the connected node.
You can reuse this component for a wide variety of queries and transactions. See [src/Transfer.js](./src/Transfer.js) for a transaction example and [src/Balances.js](./src/Balances.js) for a query example.

### Account Selector

The [Account Selector](./src/AccountSelector.js) provides the user with a unified way to
select their account from a keyring. If the Balances module is installed in the runtime,
it also displays the user's token balance. It is included in the template already.

## Miscellaneous

- Polkadot-js API and related crypto libraries depend on [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) that is only supported by modern browsers. To ensure that react-scripts properly transpile your webapp code, update the `package.json` file:

  ```json
  {
    "browserslist": {
      "production": [
        ">0.2%",
        "not ie <= 99",
        "not android <= 4.4.4",
        "not dead",
        "not op_mini all"
      ]
    }
  }
  ```

  Refer to [this doc page](https://github.com/vacp2p/docs.wakuconnect.dev/blob/develop/content/docs/guides/07_reactjs_relay.md).
