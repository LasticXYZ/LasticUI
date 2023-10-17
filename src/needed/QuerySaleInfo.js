import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QuerySaleInfo() {
    const { api } = useSubstrateState();
    const [saleInfo, setSaleInfo] = useState(null);

    // Hook to regularly fetch saleInfo data
    useEffect(() => {
      const fetchSaleInfo = async () => {
        if (api && api.query && api.query.broker && api.query.broker.saleInfo) {
          const result = await api.query.broker.saleInfo();
          setSaleInfo(result.toString());
        }
      };
      
      fetchSaleInfo();
      const intervalId = setInterval(fetchSaleInfo, 5000);
  
      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Sale Info:</h3>
        <div>{saleInfo}</div>
      </div>
    );
}

export default QuerySaleInfo;
