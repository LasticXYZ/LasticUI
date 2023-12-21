import React from 'react';
import CoreOwners from './CoreOwners';



type CoreUtilisationProps = {};

const CoreUtilisation: React.FC<CoreUtilisationProps> = () => {
  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        <CoreOwners />
    </section>

  );
};

export default CoreUtilisation;
