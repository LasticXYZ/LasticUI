'use client';

import SubTitle from '../samesections/SubTitle';
import BuyCores from './BuyCores';
import InstaGraph from './InstaGraph';

const InstaCore = () => {
    return (
      <>
        <SubTitle subtitle="Instantanious Coretime" />
        <section className="mx-auto max-w-9xl py-2 px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
            <div className="grid grid-cols-3 gap-8 flex-grow">
                <div className="col-span-2 flex flex-col items-stretch w-full">
                    <InstaGraph /> 
                </div>
                <div className="col-span-1">
                    <BuyCores />
                </div>
            </div>
        </section>
      </>
    );
};

export default InstaCore;