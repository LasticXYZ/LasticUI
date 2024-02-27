<div align="center">
  <h1 align="center">🔄 CoretimeSplitters</h1>
  <h3>Selling Coretime made easier</h3>
  <img src="logo.png" alt="logo" />
</div>

Agile Coretime is set to debut on Polkadot, introducing a new system that optimizes blockspace allocation, enabling users to purchase and manage time-based assets efficiently. This innovation has spurred the creation of secondary marketplaces like Lastic, where users can trade Coretime in a user-friendly environment. Our hackathon project enhances Lastic by adding a feature for the partitioning and interlacing of Coretime NFTs, aiming to boost market efficiency. We're prioritizing user experience and interface design to ensure that dividing Coretime assets is straightforward for all users.

⚙️ Built using [Next.js](https://nextjs.org/), uses pnpm and Tailwind css.

<!-- - 💸 **High-Efficiency Liquidity Pools**: Maximize your returns with our unique liquidity pool structure.
- 🤑 **Robust Fee Structure**: Benefit from our competitive 3% fee, optimized to reward liquidity providers generously.
- 🗄️ **Advanced Storage Solutions**: Utilize our dual mapping system for efficient and secure asset management.
- 🌊 **Smart Pool Management**: Experience seamless pool creation, modification, and destruction, ensuring optimal operational efficiency. -->

# CoreTimeSplitters

Welcome to the **CoreTimeSplitters** repository! This repository is dedicated to enabling seamless interaction with the Coretime Parachain.

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


## 🚀 Quick Start

## Getting Started

To set up and run the project, follow the steps below:

```bash
# Install the required dependencies
pnpm install
```

Copy the `.env.local.example` and rename it to `.env.local`. If you are using Subscan create a subscan public token and add it here: NEXT_PUBLIC_SUBSCAN_TOKEN='...'.

Set up the environmental variables, copy and rename `.env.local.example`.

```
# Start the development server
pnpm run dev
```

## Visual Resources

### Flow Chart:

Click on the image below to access the full-sized flow chart:

[Click to visit Flow Chart](https://www.figma.com/file/aFn15lyvti5hqLJBNUDZlU/Lastic-Flow-Chart-%231?type=whiteboard&node-id=0%3A1&t=ZiWNv9gRsH68D5Km-1)

![FLOW CHART](https://github.com/LasticXYZ/LasticUI/assets/30662672/a08dd7b3-bc14-4d51-9689-75bac7895b26)
