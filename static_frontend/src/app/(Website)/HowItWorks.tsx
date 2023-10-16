import React from 'react';

const HowItWorks = () => {
    return (
        <div className="bg-white">
        <section className="mx-auto max-w-9xl px-4 py-28 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold mb-8 font-syncopate text-center">HOW IT WORKS?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                <div className="flex flex-col items-center">
                <div className='text-7xl p-9'>🚀</div>
                    <h3 className="text-xl font-bold mb-2">1. Launch Marketplace</h3>
                    <p className="text-center text-sm">Enter Lastic and explore the dynamic coretime sales. Purchase value depends on when you buy within the cycle.</p>
                </div>

                <div className="flex flex-col items-center">
                <div className='text-7xl p-9'>🪪</div>
                    <h3 className="text-xl font-bold mb-2">2. Connect Wallet</h3>
                    <p className="text-center text-sm">Securely integrate your web3 wallet with Lastic for safe transactions.</p>
                </div>

                <div className="flex flex-col items-center">
                <div className='text-7xl p-9'>💸</div>
                    <h3 className="text-xl font-bold mb-2">3a. Start Trading</h3>
                    <p className="text-center text-sm">Dive in and trade blockspace with real-time data at your fingertips.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className='text-7xl p-9'>💪</div>
                    <h3 className="text-lg font-bold mb-2">3b. Buy Coretime</h3>
                    <p className="text-center text-sm">Browse and purchase coretimes that fit your project's needs.</p>
                </div>

                <div className="flex flex-col items-center">
                <div className='text-7xl p-9'>💰</div>
                    <h3 className="text-xl font-bold mb-2">4a. Earn Money</h3>
                    <p className="text-center text-sm">Position your coretime effectively and maximize your returns.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className='text-7xl p-9'>🤝</div>
                    <h3 className="text-xl font-bold mb-2">4b. Connect Your Parachain</h3>
                    <p className="text-center text-sm">Link your parachain to Lastic and tap into Polkadot's vast ecosystem.</p>
                </div>

            </div>
        </section>
        </div>
    );
};

export default HowItWorks;
