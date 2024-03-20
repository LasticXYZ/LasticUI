'use client';

import CoreItemPurchase from '@/components/cores/CoreItemPurchase';
import { useEffect, useState } from 'react';
import SubTitle from '../samesections/SubTitle';

interface Core {
  id: number;
  coreNumber: number;
  size: number;
  cost: number;
  reward: number;
  owner: string;
  currencyCost: string;
  currencyReward: string;
  mask: string;
  begin: string;
  end: string;
}

// If you have a larger data structure such as:
interface Database {
  listings: Core[];
}

const ParaIdPage = () => {
  const [cores, setCores] = useState<Core[]>([]);

  useEffect(() => {
    async function fetchCores() {
      const response = await fetch('/database.json'); // Adjust the path if your public directory is structured differently
      const data: Database = await response.json();
      setCores(data.listings); // Assuming your JSON structure based on your initial input
    }

    fetchCores().catch(console.error);
  }, []);

  return (
    <>
      <SubTitle subtitle='Cores for Sale' /> 

      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
        <div>
          {cores.map((core) => (
            <div key={core.id} className="p-6">
              <CoreItemPurchase
                coreNumber={core.coreNumber.toString()}
                size={core.size.toString()}
                cost={core.cost.toString()}
                reward={core.reward.toString()}
                currencyCost={core.currencyCost}
                currencyReward={core.currencyReward}
                mask={core.mask}
                begin={core.begin}
                end={core.end}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ParaIdPage;
