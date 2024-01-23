import React from 'react'
import Border from '../border/Border'

type FeatureCardProps = {
  title: string
  description: string
}

const AboutCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <Border>
      <div className="px-8 py-12">
        <h4 className="font-semibold text-lg">{title}</h4>
        <div className="w-10 h-1 my-3 rounded-full bg-pink-3"></div>
        <p className="text-sm">{description}</p>
        <div className="py-2"></div>
      </div>
    </Border>
  )
}

export default AboutCard
