import AccordionTile from '@/components/accordion/AccordionTile'
import Border from '@/components/border/Border'
import MiniBarGraph from '@/components/graph/MiniBarGraph'
import React from 'react'
import CoreOwners from './CoreOwners'

type CoreUtilisationProps = {}

const CoreUtilisation: React.FC<CoreUtilisationProps> = () => {
  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-2xl font-unbounded uppercase font-bold">core utilization</h1>
        </div>
        <div className="grid grid-cols-4 font-montserrat p-6 w-full">
          <div className="col-span-1 grid grid-cols-1 gap-4 mb-4">
            <div className=" p-2">
              <AccordionTile question="Core Utilization" answer="twr-aerawerae" />
              <AccordionTile question="Project Name" answer="twr-aerawerae" />
              <AccordionTile question="Para ID" answer="twr-aerawerae" />
              <AccordionTile question="Nb. of Cores Owned" answer="twr-aerawerae" />
              <AccordionTile question="% Owned<" answer="twr-aerawerae" />
              <AccordionTile question="Period Until Renewal" answer="twr-aerawerae" />
              <AccordionTile question="Monthly price per Core" answer="twr-aerawerae" />
              <AccordionTile question="Volume and Price" answer="twr-aerawerae" />
            </div>
          </div>
          <div className=" col-span-3 p-4">
            <MiniBarGraph />
          </div>
        </div>
        <CoreOwners />
      </Border>
    </section>
  )
}

export default CoreUtilisation
