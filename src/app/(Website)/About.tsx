'use client'

import AboutCard from '@/components/card/AboutCard'

export default function About() {
  const features = [
    {
      title: 'One Marketplace, Multiple Solutions',
      description:
        'A one-stop shop for L2s and Appchains, and a speculation market for the same resources. Unleash the potential of modular solutions with Lastic.',
    },
    {
      title: 'A New Game for Traders',
      description:
        'With Lastic, traders get access to efficient pricing models and can engage in futures and options trading on necessary resources.',
    },
    {
      title: 'Efficiency for Developers',
      description:
        'Lastic finds the most cost-efficient and fastest services, such as Data Availability and Co-Processing, tailored to builders’ specific needs.',
    },
    {
      title: 'Protocol-Agnostic Flexibility',
      description:
        'Lastic leverages the best features of major networks to provide unparalleled service to builders and traders, optimizing costs, speeds, and efficiency.',
    },
    {
      title: 'Best in-Class User Experience',
      description:
        'Lastic offers an interface that turns complexity into simplicity, providing minimal pairs for easy and confident decision-making.',
    },
    {
      title: 'Beyond Blockchains',
      description:
        'Lastic sees blockspace as a diverse class of commodities, each varying in quality, availability, and flexibility, aiming to service all aspects of the modular web3.',
    },
  ]

  return (
    <div className="overflow-hidden border-y border-gray-16">
      <div className="mx-auto max-w-9xl py-14 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:mr-5 px-6 py-10 md:p-20">
          <div className="max-w-2xl">
            <h6 className="uppercase text-md px-1 text-pink-400 font-bold font-inter py-3">
              For Builders
            </h6>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-syne">
              Lastic Breathes life into Modularity.
            </h1>
          </div>
          <p className="md:ml-5 text-md md:text-lg font-dm_sans text-gray-4">
            Lastic is a protocol-agnostic application that leverages the best features of major
            networks in order to provide the best service to builders and traders alike.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-5 gap-8">
          {features.map((feature, index) => (
            <AboutCard key={index} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </div>
  )
}
