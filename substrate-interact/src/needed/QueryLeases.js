import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryLeases() {
    const { api } = useSubstrateState();
    const [leases, setLeases] = useState(null);

    // Hook to regularly fetch saleInfo data
    useEffect(() => {
      const fetchLeases = async () => {
        if (api && api.query && api.query.broker && api.query.broker.leases) {
          const result = await api.query.broker.leases();
          setLeases(result.toString());
        }
      };
      
      fetchLeases();
      const intervalId = setInterval(fetchLeases, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Leases:</h3>
        <div>{leases}</div>
      </div>
    );
}

export default QueryLeases;
