# LasticUI

Welcome to the **LasticUI** repository! This repository is dedicated to enabling seamless interaction with the Coretime Parachain.

## 🌿 Branch Structure
There are 3 main branches that are relevant: 
 - `development` - this branch contains most recent development
 - `main` - this branch is features deployments that have yet to be tested and released to the public. The deployment of [main branch inside folder `./static-frontend`](https://github.com/LasticXYZ/LasticUI/tree/main/static_frontend) can be also accessed on [test.lastic.xyz](https://test.lastic.xyz/)
 - `stable` - features the stable branch that is tested, this is the branch that is deployed on [lastic.xyz](https://lastic.xyz/)

## 📁 Directory Overview

The repository is organized into two primary directories:

1. `./static-frontend`: 
   - Contains the static frontend integrated with wallet connection functionality.
   - Serves as the boilerplate code that will evolve into the official Lastic website.
   - Design mirrors what's showcased in the `Figma UI`. As of now, the graphs are populated with mockup data.
   
### 🚚 Repository Migration
 - `./core_chain_sdk` has moved! Check out [LasticSDK](https://github.com/LasticXYZ/lastic-sdk) for the SDK development tailored for Coretime chain interactions.

## 🚀 Quick Start

### Prerequisites
Before you begin, ensure you have the Substrate node running. To spin up a local Substrate node run the following command:

```sh
./start.sh
```

If that doesn't work try command:
```sh
./start2.sh
```

For additional instructions on how to interact with the substrate node navigate to `./substrate-interact/README.md`.

### Run
You can run the repositories inside differnt folders either inidividually (by following instruction in the individual README.md folders) or by running the command

For installing dependencies on both repositories:
```sh
pnpm i
```

And then run:
```sh
pnpm run dev
```

Now to open up `lastic_frontend` navigate to
```
http://localhost:3000
```

and to open the `substrate_interact` navigate to
```
http://localhost:8000/substrate-front-end-template
```



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



# Lastic Static Frontend

This repository contains the boilerplate code for the Lastic website. The frontend is designed to integrate with wallet connection functionality and is based on the designs showcased in the `Figma UI`.

Functionality:
  - Houses the static frontend with wallet connection features.
  - Will be further developed into the official Lastic website.
  - The design closely follows the `Figma UI`. Currently, the graphs use mockup data for demonstration.

## Getting Started

To set up and run the project, follow the steps below:

```bash
# Install the required dependencies
pnpm install
```

Set up the environmental variables, copy and rename `.env.local.example`.

```
# Start the development server
pnpm run dev
```

## Project Framework

This project is built using [Next.js](https://nextjs.org/), uses pnpm and Tailwind css.
