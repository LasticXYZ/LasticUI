"use client"; 

import AboutCard from '@/components/card/AboutCard';
    
export default function About() {
  const features = [
    {
      title: "MARKET-BASED SCALING",
      description: "Stop overpaying for infrastructure and security. Let the usage of your chain determine the amount of blockspace you get.",
      icon: <span className="text-3xl">📈</span>
    },
    {
      title: "FLEXIBLE PAYMENT OPTIONS",
      description: "From subscriptions to automated payment models, choose how you want to pay for your blockspace.",
      icon: <span className="text-3xl">💰</span>
    },
    {
      title: "INSPIRED BY ENERGY MARKETS",
      description: "Drawing parallels from the energy sector, Lastic facilitates real-time spot markets, forward contracts, and capacity markets for blockspace.",
      icon: <span className="text-3xl">⚡</span>
    },
    {
      title: "COMMUNITY DRIVEN",
      description: "We engage with the community for feedback, insights, and collaboration to continuously enhance the Lastic.",
      icon: <span className="text-3xl">🌍</span>
    },
    {
      title: "USER-CENTRIC UI/UX",
      description: "A meticulously designed interface that simplifies blockspace trading, ensuring a hassle-free experience even for newcomers.",
      icon: <span className="text-3xl">🖥️</span>
    },
    {
      title: "FLEXIBILITY BEYOND POLKADOT",
      description: "Purchase Coretime in custom chunks and allocate variable timeslices in a needs-based fashion.",
      icon: <span className="text-3xl">🔗</span>
    }
  ]

  return (
    <div className="overflow-hidden border-y border-gray-9">

        <div className=' bg-gradient-to-b from-[#ffc5c0] '>
            <div className="mx-auto max-w-9xl py-28 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl md:text-3xl font-syncopate font-bold text-center mb-4">Features</h1>
                <h2 className="text-xl font-syncopate text-center mb-10">What sets Lastic apart </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-5 gap-6">
                    {features.map((feature, index) => (
                    <AboutCard 
                        key={index}
                        title={feature.title} 
                        description={feature.description} 
                    />
                    ))}
                </div>
            </div>

        </div>
    </div>
  )
}
