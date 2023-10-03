import { AccordionTile } from '@/components';

const FAQ = [
    {
        question : "What is the lastic Protocol?",
        answer : "The lastic protocol is a non-custodial, peer-to-peer, permissionless lending, borrowing and trading system that requires no governance or external price feeds to function. The protocol consists of pools: pairings of quote tokens provided by lenders and collateral tokens provided by borrowers. lastic is capable of accepting fungible tokens as quote tokens and both fungible and non-fungible tokens as collateral tokens.",
    },

    {
        question : "What assets can be lent ad borrowed on lastic?",
        answer : " No more than 2GB. All files in your account must fit your allotted storage space.",

    },

    {
        question : "How does lastic work?",
        answer : "Click “Forgot password” from the login page or “Change password” from your profile page. A reset link will be emailed to you.",

    },

    {
        question : "Does lastic use token governance to make changes to its smart contracts?",
        answer : "Yes! Send us a message and we’ll process your request no questions asked.",

    },

    {
        question : "Where can I learn more?",
        answer : "Chat and email support is available 24/7. Phone lines are open during normal business hours.",

    },

]

const FAQSection = () => {
  return(
    <div className="text-gray-20 bg-lastic-aqua py-20">
      <div className="mx-auto max-w-5xl">
        
          <h1 className='text-5xl text-center font-syncopate text-gray-20 font-semibold'>
            FAQ
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