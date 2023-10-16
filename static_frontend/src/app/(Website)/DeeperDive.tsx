import React from 'react';

const DeeperDive: React.FC = () => {
    return (
        <div className="flex flex-col items-center space-y-8 bg-white p-12">
            <h2 className="text-4xl font-bold">deeper DIVE</h2>
            <h3 className="text-2xl">Flexible Payment Options</h3>
            <img src="/your-image-path.jpg" alt="Deeper Dive Image" className="rounded-lg shadow-md max-w-lg" />
            <div className="text-center space-y-4">
                <h4 className="text-lg font-bold">Innovation at the Heart of Blockspace Transactions</h4>
                <p>Blockspace is more than just storage; it's an essential resource. And just like any resource, you should have multiple ways to procure it:</p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-left">
                <li>Variable Pricing Models: Pay for what you use with our variable pricing options tailored to your needs.</li>
                <li>Subscription-Based Models: Want a longer-term commitment? Opt for our subscription models and enjoy uninterrupted blockspace.</li>
                <li>Freemium Models: New to Lastic? Try our freemium models and upgrade when you're ready.</li>
                <li>Bundled Pricing: Get more for less with our bundled pricing options, perfect for large scale projects.</li>
            </ul>
        </div>
    );
};

export default DeeperDive;
