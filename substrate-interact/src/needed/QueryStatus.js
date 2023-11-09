import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryStatus() {
    const { api } = useSubstrateState();
    const [status, setStatus] = useState(null);

    // Hook to regularly fetch saleInfo data
    useEffect(() => {
      const fetchStatus = async () => {
        if (api && api.query && api.query.broker && api.query.broker.status) {
          const result = await api.query.broker.status();
          setStatus(result.toString());
        }
      };
      
      fetchStatus();
      const intervalId = setInterval(fetchStatus, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Status:</h3>
        <div>{status}</div>
      </div>
    );
}

export default QueryStatus;
