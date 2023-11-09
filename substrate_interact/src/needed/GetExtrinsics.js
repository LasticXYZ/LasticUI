import React, { useEffect, useState } from 'react';
import { useSubstrateState } from '../substrate-lib';
import {
    Grid,
  } from 'semantic-ui-react'

function GetConstants() {
    const { api } = useSubstrateState();
    const [brokerExtrinsics, setBrokerExtrinsics] = useState([]);

    const adminPrivilegesExtrinsics = [
        'unreserve',
        'setLease',
        'startSales',
        'configure',
        'reserve',
        'requestCoreCount'
      ];

    const nonAdminPrivilegesExtrinsics = brokerExtrinsics.filter(extrinsic => !adminPrivilegesExtrinsics.includes(extrinsic));


    useEffect(() => {
        if (api.tx.broker) {
          const extrinsics = Object.keys(api.tx.broker).sort();
          setBrokerExtrinsics(extrinsics);
        }
      }, [api]);      

    return (
        <div>
            {brokerExtrinsics.length > 0 && (
            <Grid>
                <Grid.Row>
                <Grid.Column width={8}>
                    <h3>Admin Privileges Extrinsics:</h3>
                    <ul>
                    {adminPrivilegesExtrinsics.map((extrinsic, index) => (
                        <li key={index}>{extrinsic}</li>
                    ))}
                    </ul>
                </Grid.Column>

                <Grid.Column width={8}>
                    <h3>Non-Admin Privileges Extrinsics:</h3>
                    <ul>
                    {nonAdminPrivilegesExtrinsics.map((extrinsic, index) => (
                        <li key={index}>{extrinsic}</li>
                    ))}
                    </ul>
                </Grid.Column>
                </Grid.Row>
            </Grid>
            )}
        </div>
    );
}

export default GetConstants;
