Here's an improved version of your `README.md`:

---

# Lastic Substrate Interact

Lastic Substrate Interact is a user interface designed to work with the Substrate framework. This directory will eventually be merged together with `../static_frontend`. This guide will help you set up and run the project.

## Prerequisites

Before you begin, ensure you have the Substrate node running. Follow the steps below to spin up a local Substrate node:

```sh
# Clone the Polkadot SDK repository
git clone git@github.com:paritytech/polkadot-sdk.git

# Navigate to the substrate directory
cd substrate

# Run the node in development mode
cargo run -p node-cli -r -- --dev
```

## Running the Frontend

To set up and run the frontend, execute the following commands:

```sh
# Install the required dependencies
pnpm i

# Start the frontend server
pnpm run dev
```

Once the server is running, you can access the frontend at:  
[http://localhost:8000/substrate-front-end-template](http://localhost:8000/substrate-front-end-template)

## Coretime Chain Setup

1. Launch the Polkadot.js application.
2. Navigate to **Development > Local node**.
3. Go to **Developer > Extrinsics**.
4. Decode and submit the following hex-encoded calls:

   - Sudo configure: `0x1600460005000000140000001e000000640000000046c323013200002d31010a000000`
   - Start sale: `0x16004604e80300000000000000000000000000001400`
   - Purchase: `0x4605a0860100000000000000000000000000`

## Template Reference

This project is based on the following template:  
[substrate-developer-hub/substrate-front-end-template](https://github.com/substrate-developer-hub/substrate-front-end-template.git)

## Configuration

Configuration files for the template are located in the `src/config` directory. The configuration loading order is as follows:

1. `common.json`
2. Environment-specific JSON file (e.g., `development.json`, `test.json`, `production.json`)
3. Environment variables (with precedence)

### Environment Configuration

- `development.json`: Affects the development environment.
- `test.json`: Affects the test environment (used with `yarn test` command).
- `production.json`: Affects the production environment (used with `yarn build` command).

For deploying your frontend to production, ensure you set the `PROVIDER_SOCKET` in `src/config/production.json` to point to your deployed node.

Some environment variables are integrated into the template's `config` object. For instance, `REACT_APP_PROVIDER_SOCKET` can override `config[PROVIDER_SOCKET]`.

For more details on React environment variables, refer to the [official documentation](https://create-react-app.dev/docs/adding-custom-environment-variables).

---

I've restructured the content for clarity, added some explanatory text, and formatted the document for better readability.