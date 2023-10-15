import React from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: JSX.Element;
};

const AboutCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center space-y-4">
      <div className="text-red-500">
        {icon}
      </div>
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="text-center">{description}</p>
    </div>
  );
}

export default AboutCard;
