import GeneralTable from '@/components/table/GeneralTable';
import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token';
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk';
import { GraphLike, PurchasedEvent, getClient } from '@poppyseed/squid-sdk';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const PastTransactions = () => {
  const { activeAccount } = useInkathon();
  const [result, setResult] = useState<GraphLike<PurchasedEvent[]> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const client = getClient();

  let { tokenSymbol } = useBalance(activeAccount?.address, true);
  tokenSymbol = tokenSymbol || 'UNIT';

  useEffect(() => {
    const fetchData = async () => {
      let query = client.eventAllPurchased(7, offset);
      const fetchedResult: GraphLike<PurchasedEvent[]> = await client.fetch(query);
      setResult(fetchedResult);
    };

    fetchData();
  }, [offset]); // Add offset to the dependency array

  const TableHeader = [
    { title: 'Time' },
    { title: 'Block Number' },
    { title: 'Purchased By'},
    { title: 'Core Nb.' },
    { title: 'RegionID Begin' },
    { title: 'Price' },
  ];

  const TableData = result?.data.event?.map((event, index) => ({
    data: [
      event.timestamp ? format(new Date(event.timestamp), 'MMMM dd, yyyy HH:mm:ss OOOO') : '',
      event.blockNumber?.toString(),
      toShortAddress(event.who, 5),
      event.regionId.core?.toString(),
      event.regionId.begin?.toString(),
      `${parseNativeTokenToHuman({paid: event.price?.toString(), decimals: 12})} ${tokenSymbol}`,
    ],
  })) || [];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setOffset(offset - 10);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setOffset(offset + 10);
  };

  return (
    <div>
        <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
          <div>
            {(result) ? (
              <>
                <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-6" />
                <div className="flex justify-between space-x-2 mt-4 p-5">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-2xl text-black border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : 'bg-blue-5 hover:bg-blue-6'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    className="px-4 py-2 bg-green-500 hover:bg-green-6 border border-gray-21 text-black font-semibold rounded-2xl"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>Loading transactions...</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default PastTransactions;
