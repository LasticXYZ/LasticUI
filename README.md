# LasticUI

Welcome to the **LasticUI** repository! This repository is dedicated to enabling seamless interaction with the Coretime Parachain.

## Branch Structure
There are 3 main branches that are relevant: 
 - `development` - this branch contains most recent development
 - `main` - this branch is features deployments that have yet to be tested and released to the public. The deployment of [main branch inside folder `./static-frontend`](https://github.com/LasticXYZ/LasticUI/tree/main/static_frontend) can be also accessed on [test.lastic.xyz](https://test.lastic.xyz/)

## Get started
You can run the repositories inside differnt folders either inidividually (by following instruction in the individual README.md folders) or by running the command

For installing dependencies on both repositories:
```sh
pnpm i
```

And then run:
```sh
pnpm run dev
```

Now to open up `lastic-frontend` navigate to
```
http://localhost:3000
```

and to open the `substrate-interact` navigate to
```
http://localhost:8000/substrate-front-end-template
```

To make the substrate-interact fully work you will also need to have the Substrate node running. Follow the steps below to spin up a local Substrate node:

```sh
# Clone the Polkadot SDK repository
git clone git@github.com:paritytech/polkadot-sdk.git

# Navigate to the substrate directory
cd substrate

# Run the node in development mode
cargo run -p node-cli -r -- --dev
```

For additional instructions on how to interact with the substrate node navigate to `./substrate-interact/README.md`.


## Directory Structure

The repository is organized into three primary directories:

1. `./static-frontend`: 
   - Contains the static frontend integrated with wallet connection functionality.
   - Serves as the boilerplate code that will evolve into the official Lastic website.
   - Design mirrors what's showcased in the `Figma UI`. As of now, the graphs are populated with mockup data.

2. `./substrate-interact`: 
   - Developed on top of the [`substrate-front-end-template`](https://github.com/substrate-developer-hub/substrate-front-end-template.git).
   - By following the guidelines in `./substrate_interact/README.md`, you can interact with the Coretime chain seamlessly.

### Moved to another repo
 `./core_chain_sdk`: 
   - The development of the core_chain_sdk has been moved to [github.com/LasticXYZ/lastic-sdk](https://github.com/LasticXYZ/lastic-sdk)
   - Currently, it contains boilerplate code essential for building an SDK to interact with the Coretime chain.
   - It is a fork of [scio-labs/use-inkathon](https://github.com/scio-labs/use-inkathon) boilerplate code


Note that to make the repository 


## Visual Resources

### Flow Chart:

Click on the image below to access the full-sized flow chart:

[Click to visit Flow Chart](https://www.figma.com/file/aFn15lyvti5hqLJBNUDZlU/Lastic-Flow-Chart-%231?type=whiteboard&node-id=0%3A1&t=ZiWNv9gRsH68D5Km-1)

![FLOW CHART](https://github.com/LasticXYZ/LasticUI/assets/30662672/a08dd7b3-bc14-4d51-9689-75bac7895b26)
### Figma UI:

After launching, navigate to Options > Fit Width for the best view.
[Click to visit Figma UI](https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FYzHexLzhb9Q4FPkM19cl1y%2FLastic%3Fpage-id%3D0%253A1%26type%3Ddesign%26node-id%3D203-897%26viewport%3D1012%252C165%252C0.06%26t%3DFBfVL9tIBH4OQJ1A-1%26scaling%3Dmin-zoom%26starting-point-node-id%3D203%253A897%26mode%3Ddesign)

![FIGMA UI](https://github.com/LasticXYZ/LasticUI/assets/30662672/442e1f73-8bd9-48a2-8139-1057ec2dddd1)

## Articles

Articles to check out: 
 - [Unlocking the Future of Blockspace](https://medium.com/lastic-marketplace/unlocking-the-future-of-blockspace-introducing-lastic-9036b9d6637)
 - [The Genesis of Lastic](https://medium.com/lastic-marketplace/the-genesis-of-lastic-a-coretime-marketplace-for-polkadot-75130e40306c)
 - [Simplifying RFC-1: Understanding Agile Coretime for the Polkadot Network](https://medium.com/lastic-marketplace/the-genesis-of-lastic-a-coretime-marketplace-for-polkadot-75130e40306c)
 - [Polkadot 2.0: A New Era of Decentralization](https://medium.com/lastic-marketplace/polkadot-2-0-a-new-era-of-decentralization-d5626a6e63e5)
 - [Unraveling Agile Coretime: Polkadot’s Innovative Resource Allocation](https://medium.com/lastic-marketplace/unraveling-agile-coretime-polkadots-innovative-resource-allocation-2c025d0daa59)
