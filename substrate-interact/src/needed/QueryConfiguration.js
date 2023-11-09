import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryConfiguration() {
    const { api } = useSubstrateState();
    const [cofiguration, setConfiguration] = useState(null);

    // Hook to regularly fetch saleInfo data
    useEffect(() => {
      const fetchConfiguration = async () => {
        if (api && api.query && api.query.broker && api.query.broker.configuration) {
          const result = await api.query.broker.configuration();
          setConfiguration(result.toString());
        }
      };
      
      fetchConfiguration();
      const intervalId = setInterval(fetchConfiguration, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Configuration:</h3>
        <div>{cofiguration}</div>
      </div>
    );
}

export default QueryConfiguration;
