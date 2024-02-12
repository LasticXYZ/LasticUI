import GeneralTable from '@/components/table/GeneralTable';
import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token';
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk';
import { GraphLike, PurchasedEvent, getClient } from '@poppyseed/squid-sdk';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

const PastTransactions = () => {
  const { activeAccount } = useInkathon();

  const [result, setResult] = useState<GraphLike<PurchasedEvent[]> | null>(null);
  const client = getClient();

  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  tokenSymbol = tokenSymbol || 'UNIT';

  const query = client.eventAllPurchased();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedResult: GraphLike<PurchasedEvent[]> = await client.fetch(query);
      setResult(fetchedResult);
    };
    
    fetchData();
  }, []);

  const reversedData = useMemo(() => {
    // Make a copy of the event array (if it exists) and reverse the copy
    return [...(result?.data.event || [])].reverse();
  }, [result]);

  const TableHeader = [
    { title: 'Time' },
    { title: 'Block Number' },
    { title: 'Purchased By'},
    { title: 'Core Nb.' },
    { title: 'RegionID Begin' },
    { title: 'Price' },
  ];

  // Transform result into table data
  const TableData = reversedData.map((event, index) => ({
    data: [
      event.timestamp ? format(new Date(event.timestamp), 'MMMM dd, yyyy HH:mm:ss OOOO') : '',
      event.blockNumber?.toString(),
      toShortAddress(event.who, 5),
      event.regionId.core?.toString(),
      event.regionId.begin?.toString(),
      `${parseNativeTokenToHuman({paid: event.price?.toString(), decimals: 12})} ${tokenSymbol}`,
    ],
  })) || [];

  return (
    <div className="">
        <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
          <div>
            {(result) ? (
              <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-6" />
            ) : (
              <p>Loading transactions...</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default PastTransactions;
