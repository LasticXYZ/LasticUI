// components/Card.tsx
import React from 'react';
import Border from '@/components/border/Border';

interface CardProps {
  timeBought: string;
  coreNumber: number;
  size: number;
  phase: string;
  cost: number;
  reward: number;
  currencyCost: string;
  currencyReward: string;
}

const Card: React.FC<CardProps> = ({
  timeBought,
  coreNumber,
  size,
  phase,
  cost,
  reward,
  currencyCost,
  currencyReward,
}) => {
  return (
    <Border>

    <div className="max-w-sm rounded overflow-hidden shadow-l p-6">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Time bought: {timeBought}</div>
        <p>Core Nb. {coreNumber}</p>
        <p>Size: {size} cores</p>
        <p>Phase: {phase}</p>
        <p>Cost: {cost} {currencyCost}</p>
        <p>Reward: {reward} {currencyReward}</p>
      </div>
    </div>
    </Border>
  );
};

export default Card;
