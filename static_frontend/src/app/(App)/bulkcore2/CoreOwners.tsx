import PrimaryButton from '@/components/button/SecondaryButton';
import MiningCard from '@/components/card/MiningCard';
import TableCardViewIcon from '@/components/icon/TableCardViewIcon';
import GeneralTable from '@/components/table/GeneralTable';
import TagComp from '@/components/tags/TagComp';
import Link from 'next/link';
import React, { useState } from 'react';


const PoolsSection = () => {
  const TableHeader = [
    { title: "#" },
    { title: "Para ID" },
    { title: "Project Name" },
    { title: "Owner" },
    { title: "Cores Owned" },
    { title: "% Owned" },
  ];

  const TableData = [
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%"],
    },
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%"],
    },
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%"],
    },
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%"],
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
      <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-6" />
    </div>

</section>
    </>
)};

export default PoolsSection;