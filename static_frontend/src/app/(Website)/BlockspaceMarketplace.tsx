import React from 'react';

const BlockspaceMarketplace = () => {
    return (
        <div className="bg-pink-1">
        <section className="mx-auto max-w-9xl py-28 px-4 sm:px-6 lg:px-8">
            <h2 className="font-syncopate text-center font-bold pt-14 px-5 text-2xl md:text-1xl xl:text-2xl">
            A Blockspace Marketplace?
            </h2>

            <div className="grid grid-cols-2 items-center justify-between p-8">
                <div className="flex-2 pr-8">
                    <img src="/assets/Images/bubble-gum.png" alt="Abstract Art" className="w-full" />
                </div>

                <div className="flex-3 pl-8">
                    <p className="my-4 text-gray-600">
                        At its core, Lastic provides a seamless marketplace for buying and
                        selling coretime in flexible chunks tailored to your needs.
                    </p>

                    <ul className='py-2 px-4'>
                        <li className="mb-2">
                        1. <strong className="font-semibold">Buy or Sell Your Coretime:</strong> 
                            Transparent bidding and asking system for coretime trading.
                        </li>
                        <li className="mb-2">
                            <strong className="font-semibold">2. Elastic Scaling for Parachains:</strong>
                            Access multiple cores as per your requirement without explicit requests.
                        </li>
                        <li className="mb-2">
                            <strong className="font-semibold">3. Automated Governance-Controlled Parameters:</strong> 
                            Allow parachains to automate their coretime allocation based on current market conditions.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        </div>
    );
};

export default BlockspaceMarketplace;
