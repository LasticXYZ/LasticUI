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

  return (
    <>
  <section className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
    <div className="flex flex-row justify-between items-center px-4">
      <h1 className=" py-9 text-xl md:text-1xl xl:text-2xl">
        Core Owners 
      </h1>
    </div>
    <div>
      <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-first-big" />
    </div>

</section>
    </>
)};

export default PoolsSection;