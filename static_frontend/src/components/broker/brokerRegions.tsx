import { useInkathon } from '@poppyseed/lastic-sdk';
import { useEffect, useState } from 'react';
import WalletStatus from '@/components/walletStatus/WalletStatus';
import CoreItem from '../cores/CoreItem';

// Define a type for the queryParams
type QueryParams = (string | number | Record<string, unknown>)[];

type RegionDetailItem = {
    begin: string;
    core: string;
    mask: string;
  };
  
type RegionDetail = RegionDetailItem[];

type RegionOwner = {
  end: string;
  owner: string;
  paid: string;
};

type Region = {
    detail: RegionDetail;
    owner: RegionOwner;
};

type RegionsType = Region[];

// Custom hook for querying substrate state
function useRegionQuery() {
    const { api } = useInkathon();
    const [data, setData] = useState<RegionsType | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        if (api?.query?.broker?.regions) {
          try {
            const entries = await api.query.broker.regions.entries();
            const regions: RegionsType = entries.map(([key, value]) => {
              const detail = key.toHuman() as RegionDetail;
              const owner = value.toHuman() as RegionOwner;
              return { detail, owner };
            });
            setData(regions);
          } catch (error) {
            console.error('Failed to fetch regions:', error);
          }
        }
      };
  
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
    return data;
  }
  

  export default function BrokerRegionData() {
    const { activeAccount, activeChain } = useInkathon();
  
    if (!activeAccount || !activeChain) {
      return <WalletStatus />;
    }
  
    const regionData = useRegionQuery();
  
    // Filter regions where activeAccount's address matches the region owner's address
    const filteredRegionData = regionData?.filter(
      region => region.owner.owner === activeAccount.address
    );
  
    return (
    filteredRegionData && filteredRegionData.length > 0 ? (

      <div>
            <div className="pt-10 pl-10">
                <h1 className="text-xl font-syncopate font-bold">cores owned</h1>
            </div>
        <div>
            {filteredRegionData.map((region, index) => (

              <div key={index}>
                <h3>Core Nb {region.detail[0].core}</h3>
                <p>Begin: {region.detail[0].begin}</p>
                <p>Core: {region.detail[0].core}</p>
                <p>Mask: {region.detail[0].mask}</p>
                <p>End: {region.owner.end}</p>
                <p>Owner: {region.owner.owner}</p>
                <p>Paid: {region.owner.paid}</p>
                <CoreItem
                    timeBought="20 Dec 2023"
                    coreNumber={2123}
                    size={1}
                    phase="Renewal Period"
                    cost={2000}
                    reward={200}
                    currencyCost="DOT"
                    currencyReward="LASTIC"
                />
              </div>
            ))}
        </div>
      </div>
      ) : (
        <WalletStatus />
      )
    );
  }
  
  