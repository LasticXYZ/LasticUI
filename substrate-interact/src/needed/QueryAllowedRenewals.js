import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryAllowedRenewals() {
    const { api } = useSubstrateState();
    const [allowedRenewals, setAllowedRenewals] = useState(null);

    // Hook to regularly fetch saleInfo data
    useEffect(() => {
      const fetchAllowedRenewals = async () => {
        if (api && api.query && api.query.broker && api.query.broker.allowedRenewals) {
          const result = await api.query.broker.allowedRenewals();
          setAllowedRenewals(result.toString());
        }
      };
      
      fetchAllowedRenewals();
      const intervalId = setInterval(fetchAllowedRenewals, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Allowed Renewals:</h3>
        <div>{allowedRenewals}</div>
      </div>
    );
}

export default QueryAllowedRenewals;
