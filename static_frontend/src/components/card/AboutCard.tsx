import React from 'react';
import Border from '../border/Border';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: JSX.Element;
};

const AboutCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Border>
        <div className='p-5'>
            <div className="text-red-500 px-1 py-5">
            {icon}
            </div>
            <h4 className="font-semibold">{title}</h4>
            <div className='w-10 h-1 my-3 rounded-full bg-pink-3'></div>
            <p className="text-xs">{description}</p>
            <div className='py-5'></div>
        </div>
    </Border>
  );
}

export default AboutCard;
