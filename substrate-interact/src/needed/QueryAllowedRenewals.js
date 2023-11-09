import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryAllowedRenewals() {
    const { api } = useSubstrateState();
    const [allowedRenewals, setAllowedRenewals] = useState(null);

    useEffect(() => {
      const fetch = async () => {
        if (api && api.query && api.query.broker && api.query.broker.allowedRenewals) {
          const result = await api.query.broker.allowedRenewals('');
          setAllowedRenewals(result.toString());
        }
      };
      
      fetch();
      const intervalId = setInterval(fetch, 5000);

      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Allowed Renewals:</h3>
        <div>{allowedRenewals ? allowedRenewals : "None"}</div>
      </div>
    );
}

export default QueryAllowedRenewals;
