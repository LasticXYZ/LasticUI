import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryPalletVersion() {
    const { api } = useSubstrateState();
    const [palletVersion, setPalletVersion] = useState(null);

    // Hook to regularly fetch palletVersion data
    useEffect(() => {
      const fetchPalletVersion = async () => {
        if (api && api.rpc && api.rpc.broker && api.rpc.broker.palletVersion) {
          const result = await api.rpc.broker.palletVersion();
          setPalletVersion(result.toString());
        }
      };
      
      fetchPalletVersion();
      const intervalId = setInterval(fetchPalletVersion, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
    return (
      <div>
        <h3>Pallet Version:</h3>
        <div>{palletVersion}</div>
      </div>
    );
}

export default QueryPalletVersion;
