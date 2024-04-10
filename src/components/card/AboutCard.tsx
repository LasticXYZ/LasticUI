import BorderBlack from '@/components/border/BorderBlack'
import React from 'react'

type FeatureCardProps = {
  title: string
  description: string
}

const AboutCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <BorderBlack>
      <div className="px-8 py-12">
        <h4 className="font-semibold font-syne text-2xl">{title}</h4>
        <div className="w-10 h-1 my-3 rounded-full bg-pink-3"></div>
        <p className="text-sm">{description}</p>
        <div className="py-2"></div>
      </div>
    </BorderBlack>
  )
}

export default AboutCard
