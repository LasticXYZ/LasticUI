import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryPalletVersion() {
    const { api } = useSubstrateState();
    const [reservations, setReservations] = useState(null);

    // Hook to regularly fetch saleInfo data
    useEffect(() => {
      const fetch = async () => {
        if (api && api.query && api.query.broker && api.query.broker.reservations) {
          const result = await api.query.broker.reservations();
          setReservations(result.toString());
        }
      };
      
      fetch();
      const intervalId = setInterval(fetch, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Reservations :</h3>
        <div>{reservations}</div>
      </div>
    );
}

export default QueryPalletVersion;
