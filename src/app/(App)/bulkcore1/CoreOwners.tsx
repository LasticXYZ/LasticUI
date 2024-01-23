import GeneralTable from '@/components/table/GeneralTable'
import TagComp from '@/components/tags/TagComp'
import React, { useState } from 'react'

const PoolsSection = () => {
  const TableHeader = [
    { title: '#' },
    { title: 'Para ID' },
    { title: 'Project Name' },
    { title: 'Owner' },
    { title: 'Cores Owned' },
    { title: '% Owned' },
    { title: 'Core Type' },
    { title: 'Period Until Renewal' },
  ]

  const TableData = [
    {
      href: '/',
      data: [
        '1.',
        '200',
        'Asset Hub',
        '0x302...1231',
        <TagComp key="tag-1" className="mx-4 my-2" title="2.12" />,
        ' 0.21%',
        'Instantanious',
        '/',
      ],
    },
    {
      href: '/',
      data: [
        '2.',
        '201',
        'Asset Hub',
        '0x303...1232',
        <TagComp key="tag-2" className="mx-4 my-2" title="3.45" />,
        ' 0.33%',
        'Instantanious',
        '/',
      ],
    },
    {
      href: '/',
      data: [
        '3.',
        '202',
        'Asset Hub',
        '0x304...1233',
        <TagComp key="tag-3" className="mx-4 my-2" title="5.67" />,
        ' 0.45%',
        'Instantanious',
        '/',
      ],
    },
    {
      href: '/',
      data: [
        '4.',
        '203',
        'Asset Hub',
        '0x305...1234',
        <TagComp key="tag-4" className="mx-4 my-2" title="7.89" />,
        ' 0.78%',
        'Instantanious',
        '/',
      ],
    },
  ]

  return (
    <>
      <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
        <div>
          <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-8" />
        </div>
      </div>
    </>
  )
}

export default PoolsSection
