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
        const result = await api.query.broker[queryKey](...queryParams);
        setData(result.toString());
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [api, queryKey, queryParams]);

  return data;
}

function Query() {
  const saleInfo = useSubstrateQuery('saleInfo');
  const configuration = useSubstrateQuery('configuration');
  const status = useSubstrateQuery('status');
  const leases = useSubstrateQuery('leases');
  const reservations = useSubstrateQuery('reservations');
  const palletVersion = useSubstrateQuery('palletVersion');
  const instaPoolIo = useSubstrateQuery('instaPoolIo', ['']);
  const allowedRenewals = useSubstrateQuery('allowedRenewals', ['']);
  const instaPoolContribution = useSubstrateQuery('instaPoolContribution', ['']);
  const instaPoolHistory = useSubstrateQuery('instaPoolHistory', ['']);
  const regions = useSubstrateQuery('regions', ['']);
  const workload = useSubstrateQuery('workload', ['']);


  return (
    <div>
        <h1>Query Items</h1>
        <h3>Sale Info:</h3>
        <div>{saleInfo}</div>
        <h3>Configuration:</h3>
        <div>{configuration}</div>
        <h3>Status:</h3>
        <div>{status}</div>
        <h3>Leases:</h3>
        <div>{leases}</div>
        <h3>Reservations:</h3>
        <div>{reservations}</div>
        <h3>Pallet Version:</h3>
        <div>{palletVersion}</div>
        <h3>Insta Pool Io</h3>
        <div>{instaPoolIo || "None"}</div>
        <h3>Allowed Renewals</h3>
        <div>{allowedRenewals || "None"}</div>
        <h3>Insta Pool Contribution</h3>
        <div>{instaPoolContribution || "None"}</div>
        <h3>Insta Pool History</h3>
        <div>{instaPoolHistory || "None"}</div>
        <h3>Regions</h3>
        <div>{regions || "None"}</div>
        <h3>Workload</h3>
        <div>{workload || "None"}</div>
    </div>
  );
}


export { Query };
