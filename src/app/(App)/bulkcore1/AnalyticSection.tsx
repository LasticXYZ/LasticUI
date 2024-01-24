import AnalyticCard from '@/components/card/AnalyticCard';
import React from 'react';

type AnalyticItem = {
  title: string;
  subtitle: string;
  change: number | string;
};

// Define props for AnalyticSection
export type AnalyticSectionProps = {
  analytics: AnalyticItem[];
};

const AnalyticSection: React.FC<AnalyticSectionProps> = ({ analytics }) => (
  <div className="grid grid-cols-1 items-stretch content-between justify-between w-full flex-grow">
    {analytics.map((item, key) => (
      <div key={key} className="py-4 flex-grow w-full">
        <AnalyticCard title={item.title} subtitle={item.subtitle} change={item.change} />
      </div>
    ))}
  </div>
)

export default AnalyticSection
