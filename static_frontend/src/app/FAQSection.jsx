import { AccordionTile } from '@/components';

const FAQ = [
  {
      question: "What is Lastic?",
      answer: "Lastic is the world's first true blockspace marketplace. It revolutionizes the way blockspace can be exchanged with the flexibility required for applications across all web3 ecosystems. Using Polkadot’s coretime model as its foundation, it ensures applications can access the blockspace they need, and blockspace providers can tailor its packaging according to market demands."
  },
  {
      question: "How does Lastic differ from current blockspace marketplaces?",
      answer: "Current blockspace marketplaces often refer to tools that MEV actors use to reorder transactions within a block for specific virtual machines or state-transition-functions. Lastic, on the other hand, offers a marketplace where buyers can manipulate the blockspace they've purchased in any way they desire, such as reordering transactions, scaling up their processing, deploying smart contracts, and more."
  },
  {
      question: "What challenges does Lastic address?",
      answer: "Lastic addresses challenges like the absence of a dedicated marketplace for buying and selling coretime in flexible chunks on Polkadot, the difficulty in obtaining cores on-demand, and the inability to sell excess blockspace, create partnerships, or acquire fine-grained coretime."
  },
  {
      question: "What features does Lastic offer?",
      answer: "Lastic provides features like market-based scaling, support for automated governance-controlled parameters, customizable coretime chunks, variable timeslices, and a wide range of payment options inspired by energy markets, including real-time spot market, day-ahead market, forward contracts, and capacity markets."
  },
  {
      question: "What architecture is Lastic planning to use?",
      answer: "Lastic is considering three potential architectures: as a Parachain, as a smart contract on a Parachain similar to Uniswap, or as a smart contract on Coretime Chain. Each has its own tradeoffs. A user interface showcasing the current state of coretime is also deemed necessary."
  },
  {
      question: "Will Lastic introduce its own token?",
      answer: "The Lastic team is currently exploring this option. However, irrespective of the decision, a fee-per-transaction revenue structure is anticipated."
  },
  {
      question: "What is Lastic's future outlook?",
      answer: "Lastic aims to be the leading blockspace marketplace across the entire web3 ecosystem, as Polkadot is strategically placed to validate a variety of VM and chain types including ZK Rollups, Optimistic Rollups, and more."
  }
]

const FAQSection = () => {
  return(
    <div className="text-gray-20 bg-[#c2f0ea] py-20">
      <div className="mx-auto max-w-5xl">
        
          <h1 className='text-5xl text-center font-syncopate text-gray-20 font-semibold'>
            Q&A
          </h1>

          {FAQ.map((item, index )=> {
              return(
                <AccordionTile key={index} question={item.question} answer={item.answer}/>
              )
          })}
      </div>
    </div>
  )
  
}

export default FAQSection;