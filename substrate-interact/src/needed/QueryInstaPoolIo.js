import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function QueryInstaPoolIo() {
    const { api } = useSubstrateState();
    const [instaPoolIo, setInstaPoolIo] = useState(null);

    useEffect(() => {
      const fetch = async () => {
        if (api && api.query && api.query.broker && api.query.broker.instaPoolIo) {
          const result = await api.query.broker.instaPoolIo('');
          setInstaPoolIo(result.toString());
        }
      };
      
      fetch();
      const intervalId = setInterval(fetch, 5000);

      return () => clearInterval(intervalId);
    }, [api]);
  
  
    return (
      <div>
        <h3>Insta Pool Io:</h3>
        <div>{instaPoolIo ? instaPoolIo : "None"}</div>
      </div>
    );
}

export default QueryInstaPoolIo;
