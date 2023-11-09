import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

// Custom hook for querying substrate state
function useSubstrateQuery(queryKey, queryParams = []) {
    const { api } = useSubstrateState();
    const [data, setData] = useState(null);

    useEffect(() => {

        let intervalId;

      const fetchData = async () => {
        if (api?.query?.broker?.[queryKey]) {
          try {
            const result = await api.query.broker[queryKey](...queryParams);
            // Check if the Option type is Some and unwrap the value
            if (result.isSome) {
              setData(result.unwrap().toString());
            } else {
              setData(null);
            }
          } catch (error) {
            console.error(`Failed to fetch ${queryKey}:`, error);
          }
        }
      };

      fetchData();
      intervalId = setInterval(fetchData, 10000);

      return () => clearInterval(intervalId);
    }, [api, queryKey, queryParams]);
  
    return data;
  }
  
  export default function QueryRegions() {
    //let regionId = {begin: '54424', 'core': '0', 'mask': '0xffffffffffffffffffff'};
    let regionId = {begin: '54424', 'core': '0', 'mask': '0xffffffffffffffffffff'};
    const regionData = useSubstrateQuery('regions', [regionId]);
  
    return (
      <div>
        <h3>Region Data:</h3>
        <div>{regionData || "No data for this region"}</div>
      </div>
    );
  }
  