const TransactionsSection = () => {
  const { poolId } = useParams();
  const { data: pool } = usePool(poolId);
  const { data: transactions } = usePoolTransactions(poolId);

  return (
    <>
      <div className="relative overflow-x-auto border rounded-2xl border-gray-20 py-5 px-5">
        <div className='relative overflow-x-auto shadow-md rounded-2xl'>
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-21 p-2 text-white rounded-2xl">
              <tr className='rounded-2xl'>
                <th className="px-6 py-5  rounded-l-2xl"># Collateral token / Quote Token</th>
                <th className="px-6 py-5">APR ?</th>
                <th className="px-6 py-5">Total Value Locked ?</th>
                <th className="px-6 py-5">lastic Burned ?</th>
                <th className="px-6 py-5  rounded-r-2xl">Pool Actions</th>
              </tr>
            </thead>
            <tbody >
              <tr className='p-2 border-b border-gray-20'>
                <td className="px-6 py-3">1 DAI / USDC</td>
                <td className="px-6 py-3"><TagComp className="mx-4 my-2" title="4.25%"/></td>
                <td className="px-6 py-3">1.18M USDC</td>
                <td className="px-6 py-3">1,273 lastic</td>
                <td className="px-6 py-3"><Link href="/" className="rounded-full border border-purple-7 hover:bg-purple-8 px-12 py-2">Details</Link></td>
              </tr>
              <tr className='p-2 border-b border-gray-20'>
                <td className="px-6 py-3">1 DAI / USDC</td>
                <td className="px-6 py-3"><TagComp className="mx-4 my-2" title="4.25%"/></td>
                <td className="px-6 py-3">1.18M USDC</td>
                <td className="px-6 py-3">1,273 lastic</td>
                <td className="px-6 py-3"><Link href="/" className="rounded-full border border-purple-7 hover:bg-purple-8 px-12 py-2">Details</Link></td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}


export default TransactionsSection;