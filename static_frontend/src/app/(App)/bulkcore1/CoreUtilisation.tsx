import React from 'react';
import CoreOwners from './CoreOwners';
import MiniBarGraph from "@/components/graph/MiniBarGraph"
import Border from '@/components/border/Border';


type CoreUtilisationProps = {};

const CoreUtilisation: React.FC<CoreUtilisationProps> = () => {
  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        <Border>
            <div className="mb-4 p-10">
                <h1 className="text-xl font-syncopate font-bold">core utilization</h1>
            </div>
            <div className="grid grid-cols-4 font-montserrat p-6 w-full">
            <div className="col-span-1 grid grid-cols-1 gap-4 mb-4">
            <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Core Type</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Project Name</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Para ID</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Nb. of Cores Owned</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>% Owned</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Period Until Renewal</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Monthly price per Core</option>
                </select>
                <select className="border-b bg-transparent border-gray-9 p-2">
                <option>Volume and Price</option>
                </select>
            </div>
            <div className=" col-span-3 p-4">
                <MiniBarGraph />
            </div>
            </div>
            <CoreOwners />

        </Border>
    </section>

  );
};

export default CoreUtilisation;
