import AccordionTile from '@/components/accordion/AccordionTile';

const FAQ = [
  {
      question: "What is blockspace?",
      answer: "Blockspace is the product of blockchains. It is the space available within a block in a blockchain where transactions and other data can be processed, verified, and stored. Each block in a blockchain has a maximum size or capacity, and the transactions that are to be included in the block must fit within this space. The transactions within a block must also meet the requirements of the format that the blockchain will allow. The concept of blockspace is crucial in understanding the value proposition of Coretime on Polkadot, as it forms the basis for how computational resources are allocated and priced within the network. Through the purchasing and trading of blockspace via Coretime, Polkadot aims to create a more dynamic and flexible system for developers and projects to access and utilize the network's resources."
  },
  {
      question: "What is a blockspace marketplace?",
      answer: "A Blockspace marketplace refers to a platform that facilitates the buying, selling, or allocation of blockchain execution and storage space, known as blockspace. There are two types of marketplaces that allow for purchasing of blockspace, namely primary and secondary marketplaces. In the case of Lastic, the primary marketplace is the purchasing of coretime provided by the network directly. Whereas, the secondary marketplace is where blockspace can be divided and re-sold to participants."
  },
  {
      question: "What is Coretime on Polkadot?",
      answer: "In the context of Polkadot and its Coretime feature, blockspace takes on a more specialized meaning. Coretime allows for the purchasing of blocks in a span of time, which essentially is the allocation of blockspace for validation and consensus processes on the Polkadot Relay Chain. When a user or project purchases Coretime, they are essentially buying the right to use a portion of the blockspace within a given block or series of blocks on the Polkadot blockchain. This is akin to reserving computational resources and space on the blockchain for a specified amount of time."
  },
  {
      question: "What can the blockspace be used for?",
      answer: "Blockspace on Polkadot serves as a crucial resource for executing and finalizing operations, such as transactions, within a block​. By providing expanded blockspace, Polkadot ensures an uninterrupted flow of bandwidth even during heavy congestion periods, which is pivotal for the network's cost-effectiveness. The blockspace ecosystem on Polkadot has evolved post the rollout of parachains, fostering a conducive environment for Web3 development with a spectrum of blockspace offerings that are secure, composable, flexible, efficient, and cost-effective. This ecosystem propels boundless innovation by ensuring interoperability among diverse blockchains, thereby offering economic scalability. Future upgrades of Polkadot will alter the way blockspace resources are allocated, removing the requirement of cores to be utilized only by parachains. Future implementations on the protocol roadmap include the ability for smart contracts, synchronous processes, and a vast range of computations to utilize the blockspace Polkadot provides and Lastic will help developers harness the power of flexible blockspace in this way."
  },
  {
      question: "Who will be able to buy and sell blockspace on Lastic?",
      answer: "Lastic is building a user-friendly interface that serves builders, tinkerers, and traders alike. With the help of the Polkadot community, we plan on making blockspace buying, selling and splitting as easy as trading tokens on a decentralized exchange."
  },
  {
      question: "When will Lastic launch?",
      answer: "The Lastic team is currently exploring this option. However, irrespective of the decision, a fee-per-transaction revenue structure is anticipated."
  }
]

const FAQSection = () => {
  return(
    <div className="text-gray-20 min-h-screen py-20 pt-32">
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