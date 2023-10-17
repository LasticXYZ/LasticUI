import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';

function GetConstants() {
    const { api } = useSubstrateState();
    const [brokerConstants, setBrokerConstants] = useState({});

    useEffect(() => {
        if (api) {
            const consts = api.consts.broker;
            setBrokerConstants(consts);
        }
    }, [api]);

    return (
        <div>
            <h3>Broker Constants:</h3>
            <pre>{JSON.stringify(brokerConstants, null, 2)}</pre>
        </div>
    );
}

export default GetConstants;
