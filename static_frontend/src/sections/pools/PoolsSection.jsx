import PrimaryButton from '@/components/button/PrimaryButton';
import MiningCard from '@/components/card/MiningCard';
import TableCardViewIcon from '@/components/icon/TableCardViewIcon';
import GeneralTable from '@/components/table/GeneralTable';
import TagComp from '@/components/tags/TagComp';
import Link from 'next/link';
import React, { useState } from 'react';


const PoolsSection = () => {
  const TableHeader = [
    { title: "# Collateral token / Quote Token" },
    { title: "APR ?" },
    { title: "Liquidity" },
    { title: "lastic Burned" },
  ];

  const TableData = [
    {
      href: "/",
      data: ["1 DAI / USDC", <TagComp className="mx-4 my-2" title="4.25%"/>, "1.18M USD", "1,273 lastic"],
    },
    {
      href: "/",
      data: ["1 DAI / USDC", <TagComp className="mx-4 my-2" title="4.25%"/>, "1.18M USD", "1,273 lastic"],
    },
    {
      href: "/",
      data: ["1 DAI / USDC", <TagComp className="mx-4 my-2" title="4.25%"/>, "1.18M USD", "1,273 lastic"],
    },
    {
      href: "/",
      data: ["1 DAI / USDC", <TagComp className="mx-4 my-2" title="4.25%"/>, "1.18M USD", "1,273 lastic"],
    }
  ]

  const [showFirstDiv, setShowFirstDiv] = useState(true);

  const toggleDivs = () => {
    setShowFirstDiv(!showFirstDiv);
  };

  return (
    <>
  <section className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
    <div className="flex flex-row justify-between items-center px-4">
      <h1 className=" py-9 text-xl md:text-1xl xl:text-2xl">
        Top Pools 
      </h1>
      <button onClick={toggleDivs}><TableCardViewIcon cardView={ showFirstDiv } /></button>
    </div>
    <div>
      {showFirstDiv ? (
          <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-first-big" />
      ) : (
        <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          <MiningCard />
          <MiningCard />
          <MiningCard />
          <MiningCard />
          <MiningCard />
        </div>
      )}
    </div>

</section>
    </>
)};

export default PoolsSection;