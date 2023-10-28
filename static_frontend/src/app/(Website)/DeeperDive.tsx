// Dependencies
import Image from 'next/image';
import React from 'react';

const DeeperDive: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center border-b border-gray-9 py-20 bg-white bg-opacity-70 p-12">
            
            <div className='py-5'>
                {/* Title */}
                <h1 className="text-3xl font-syncopate font-bold text-center mb-4">Deeper dive</h1>

                {/* Subtitle */}
                <h2 className="text-xl font-syncopate text-center mb-10">Flexible Payment Options</h2>

            </div>
            
            {/* Image and Info Container */}
            <div className='flex flex-row gap-4'>
                
                {/* Image */}
                <Image 
                    src="/assets/Images/deeper_dive.png"
                    alt="Deeper Dive Image"
                    width={500}
                    height={500}
                    className="rounded-lg shadow-md max-w-lg"
                />
                
                {/* Info */}
                <div className=' max-w-xl p-10'>
                    <div className="text-lg text-left space-y-4 py-5">
                    <p><span className="font-bold pr-3">Innovation at the Heart of Blockspace Transactions</span>
                        Blockspace is more than just storage; it's an essential resource. And just like any resource, you should have multiple ways to procure it:</p>
                    </div>

                    {/* List */}
                    <ul className="list-disc p-10  text-left">
                        <li><span className='font-bold'>Variable Pricing Models: </span> Pay for what you use with our variable pricing options tailored to your needs.</li>
                        <li><span className='font-bold'>Subscription-Based Models: </span> Want a longer-term commitment? Opt for our subscription models and enjoy uninterrupted blockspace.</li>
                        <li><span className='font-bold'>Freemium Models: </span> New to Lastic? Try our freemium models and upgrade when you're ready.</li>
                        <li><span className='font-bold'>Bundled Pricing: </span> Get more for less with our bundled pricing options, perfect for large scale projects.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DeeperDive;
