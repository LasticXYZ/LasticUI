import GeneralTable from '@/components/table/GeneralTable';
import TagComp from '@/components/tags/TagComp';
import React, { useState } from 'react';


const PoolsSection = () => {
  const TableHeader = [
    { title: "#" },
    { title: "Para ID" },
    { title: "Project Name" },
    { title: "Owner" },
    { title: "Cores Owned" },
    { title: "% Owned" },
    { title: "Core Type" },
    { title: "Period Until Renewal" },
  ];

  const TableData = [
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%", "Instantanious",  "/"],
    },
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%", "Instantanious",  "/"],
    },
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%", "Instantanious",  "/"],
    },
    {
      href: "/",
      data: ["1.", "200", "Asset Hub", "0x302...1231", <TagComp className="mx-4 my-2" title="2.12"/>, " 0.21%", "Instantanious",  "/"],
    }
  ]

  return (
    <>
  <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
    <div>
      <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-8" />
    </div>
    </div>
    </>
)};

export default PoolsSection;