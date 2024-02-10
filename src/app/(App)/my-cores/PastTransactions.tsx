import Border from '@/components/border/Border';
import GeneralTable from '@/components/table/GeneralTable';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { useInkathon } from '@poppyseed/lastic-sdk';
import { PurchasedEvent, getClient } from '@poppyseed/squid-sdk';
import { useEffect, useState } from 'react';

type GraphLike<T> = { data: { event?: T[], call?: T } };

const PastTransactions = () => {
  const { activeAccount } = useInkathon();
  const [result, setResult] = useState<GraphLike<PurchasedEvent[]> | null>(null);
  const client = getClient();
  const publicKeyBytes = decodeAddress(activeAccount?.address);
  const targetNetworkPrefix = 2; // For example, Kusama prefix
  const newAddress = encodeAddress(publicKeyBytes, targetNetworkPrefix);
  const query = client.eventWhoPurchased(newAddress);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedResult = await client.fetch(query);
      setResult(fetchedResult);
    };

    if (newAddress) {
      fetchData();
    }
  }, [newAddress]);

  // Define the table header
  const TableHeader = [
    { title: '#' },
    { title: 'Block Number' },
    { title: 'Core' },
    { title: 'RegionID Begin' },
    { title: 'Mask' },
    { title: 'Price' },
  ];

  // Transform result into table data
  const TableData = result?.data.event?.map((event, index) => ({
    href: '/', // Assuming you might have a detail page for each transaction
    data: [
      event.timestamp.toString(),
      event.regionId.core.toString(),
      event.regionId.begin.toString(),
      event.regionId.mask,
      event.blockNumber.toString(),
      `${event.price?.toString()} UNIT`, // Replace UNIT with actual currency unit if available
    ],
  })) || [];

  return (
    <div className="mt-8">
      <Border>
        <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <div className="pt-10 pl-10">
            <h1 className="text-xl font-syncopate font-bold">My past transactions</h1>
          </div>
          <div>
            {result ? (
              <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-7" />
            ) : (
              <p>Loading transactions...</p>
            )}
          </div>
        </div>
      </Border>
    </div>
  );
};

export default PastTransactions;
