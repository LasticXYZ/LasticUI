import React from 'react';
import AboutCard from '@/components/card/AboutCard';

const Background: React.FC = () => {
    return (
      <div className=" w-full h-[1002px] left-[-1px] top-[2674px] bg-gray-300 ">
        <div className=" w-[1567px] h-[1003.88px] left-[-1px] top-[-1.88px] bg-[#FAF7F8]">
          <div className=" w-[1004px] h-[332px] left-[281px] top-[542px] bg-[#FA857A] blur-[350px]"></div>
        </div>
      </div>
    );
}
    
export default function Home() {
  const features = [
    {
      title: "MARKET-BASED SCALING",
      description: "Enhance the scalability of your parachains with on-demand multiple cores.",
      icon: <span className="text-3xl">📈</span>
    },
    {
      title: "FLEXIBLE PAYMENT OPTIONS",
      description: "From subscriptions to freemium models, choose how you want to pay for your blockspace.",
      icon: <span className="text-3xl">💰</span>
    },
    {
      title: "INSPIRED BY ENERGY MARKETS",
      description: "Drawing parallels from the energy sector, Lastic facilitates real-time spot markets, forward contracts, and capacity markets for blockspace.",
      icon: <span className="text-3xl">⚡</span>
    },
    {
      title: "COMMUNITY DRIVEN",
      description: "Actively engaging with the Polkadot and wider blockchain community for feedback, insights, and collaboration to continuously enhance the platform.",
      icon: <span className="text-3xl">🌍</span>
    },
    {
      title: "USER-CENTRIC UI/UX",
      description: "A meticulously designed interface that simplifies blockspace trading, ensuring a hassle-free experience even for newcomers.",
      icon: <span className="text-3xl">🖥️</span>
    },
    {
      title: "FLEXIBILITY BEYOND POLKADOT",
      description: "Purchase coretime in custom chunks and allocate variable time slices as per your workload.",
      icon: <span className="text-3xl">🔗</span>
    }
  ]

  return (
    <div className="overflow-hidden">
        <div className='absolute z-20  w-full h-full overflow-hidden'>
            <Background />
        </div>

        <div className='relative z-50'>
            <div className="mx-auto max-w-9xl py-28 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-syncopate font-bold text-center mb-4">ABOUT</h1>
                <h2 className="text-xl font-syncopate text-center mb-10">KEY FEATURES THAT SET US APART</h2>
                <div className="grid grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                    <AboutCard 
                        key={index}
                        title={feature.title} 
                        description={feature.description} 
                        icon={feature.icon} 
                    />
                    ))}
                </div>
            </div>

        </div>
    </div>
  )
}
