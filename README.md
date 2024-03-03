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

## Features
We forked the LasticUI repo from Lastic as starting point. We implemented 2 new features to improve the functionality of Lastic in a user-friendly manner. Both features and their inner workings are explained below.

### Splitting coretime
Coretime in Polkadot can be split/partitioned at the region level. By calling this function, a single Coretime NFT is divided in two Coretime NFT's at a certain point (pivot). For example, a Coretime NFT containing region 1-50 is split at pivot 26. This results in two new Coretime NFT's with these regions:
- Region 1-25
- Region 26-50


### Interlacing coretime
It's also possible to divide at a more detailed level, by applying a Core Mask. Each single region consists of 80 blocks. a Core Mask is an 80-bit bitmap, which indicates which of the 80 blocks can be utilized by the owner of this nft. By interlacing, a Core Mask is applied, which creates two new NFT's:
- One with the Core Mask
- Another one with the opposite Core Mask (XOR)

Both these features do not transfer any NFT's. In both cases the original NFT is destroyed, and two new NFT's are minted to the original owner.

## Visual Resources

### Flow Chart:

TODO
<!-- Click on the image below to access the full-sized flow chart:

[Click to visit Flow Chart](https://www.figma.com/file/aFn15lyvti5hqLJBNUDZlU/Lastic-Flow-Chart-%231?type=whiteboard&node-id=0%3A1&t=ZiWNv9gRsH68D5Km-1)

![FLOW CHART](https://github.com/LasticXYZ/LasticUI/assets/30662672/a08dd7b3-bc14-4d51-9689-75bac7895b26) -->


## Next steps

After the hackathon we will continue this project, by intregrating the new features into Lastic. Also we will further research and build additional features that can improve user experience on Lastic.

## Hackathon bounties

- Best use of Polkadot

## Links

- [Video demo]()
- [Presentation slides]()
- [Vercel deployment]()


## Team
This project was build during Encode X Polkadot hackathon 2024 by:

- [Noah](https://www.linkedin.com/in/njoeris/)
- [Gunjan](https://www.linkedin.com/in/gunjan321/)
- [arjanjohan](https://x.com/arjanjohan/)