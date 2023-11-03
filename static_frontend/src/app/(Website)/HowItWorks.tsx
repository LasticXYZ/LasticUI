import Image from 'next/image';
import React from 'react';

const HowItWorks = () => {
    return (
        <div className="bg-white">
            <section className="mx-auto max-w-9xl px-4 py-28 sm:px-6 lg:px-8">
                <h2 className="text-lg md:text-3xl font-semibold mb-8 font-syncopate text-center">HOW DOES IT WORK?</h2>
                
                {/* Image for large screens */}
                <div className="hidden lg:block">
                    <Image 
                        src="/assets/Images/how-it-works.png"
                        alt="How it works"
                        width={1000}
                        height={500}
                        className="w-full"
                    />
                </div>

                {/* Image for small screens */}
                <div className="lg:hidden">
                    <Image 
                        src="/assets/Images/how-it-works2.png"
                        alt="How it works"
                        width={500}
                        height={250}
                        className="w-full px-2"
                    />
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
