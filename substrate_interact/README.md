# Lastic Substrate Interact
Lastic Substrate Interact is a user interface designed to work with the Substrate framework. This directory will eventually be merged together with `../static_frontend`. This guide will help you set up and run the project.

## Prerequisites

Before you begin, ensure you have the Substrate node running. To spin up a local Substrate node run the following command:

```sh
../start.sh
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

Check the guide in the docs.lastic to help you interact with the Coretime chain
 - [installation guide](https://docs.lastic.xyz/substrate-interact/)
 - [interaction instructions](https://docs.lastic.xyz/substrate-interact/interact.html)

### Alternative way (more difficult)
1. Launch the Polkadot.js application.
2. Navigate to **Development > Local node**.
3. Go to **Developer > Extrinsics**.
4. Decode and submit the following hex-encoded calls:

   - Sudo configure: `0x1600460005000000140000001e000000640000000046c323013200002d31010a000000`
   - Start sale: `0x16004604e80300000000000000000000000000001400`
   - Purchase: `0x4605a0860100000000000000000000000000`

 - Reserve: `0x1600460005000000140000001e000000640000000046c323013200002d31010a000000`

## Template Reference

This project is based on the following template:  
[substrate-developer-hub/substrate-front-end-template](https://github.com/substrate-developer-hub/substrate-front-end-template.git)

