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



## Instructions for starting the Coretime chain
 - Open up Polkadot.js
 - switch to Development > Local node. 
 - open up Developer > Extrinsics
 - in Decode submit the following hex-encoded calls:

Sudo configure:
0x1600460005000000140000001e000000640000000046c323013200002d31010a000000

Start sale:
0x16004604e80300000000000000000000000000001400

Purchase:
0x4605a0860100000000000000000000000000



---

This project is built upon this template: `https://github.com/substrate-developer-hub/substrate-front-end-template.git`



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

