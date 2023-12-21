import React, { useState } from 'react';
import { Grid, Form } from 'semantic-ui-react';

import { useSubstrateState } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';

function Reserve(props) {
  const [status, setStatus] = useState(null);

  // Hardcoded config object for the Reserve function
  const reserve = {
    advanceNotice: 5,
    interludeLength: 20,
    leadinLength: 30,
    regionLength: 100,
    idealBulkProportion: 600000000,
    limitCoresOffered: 50, // Optional parameter
    renewalBump: 20000000,
    contributionTimeout: 10,
  };

  // Hardcoded parameters for the startSales function
  const initialPrice = 1000;
  const coreCount = 20;

  return (
    <Grid.Column width={8}>
      <h3>Broker Pallet - Set up sudo Interactions </h3>
      <Form>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Reserve"
            type="SUDO-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'broker',
              callable: 'Reserve',
              inputParams: [reserve],
              paramFields: [{ name: 'reserve', type: 'Object', optional: false }],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function BrokerInteractor(props) {
  const { api } = useSubstrateState();
  return api.tx && api.tx.sudo ? <Reserve {...props} /> : null;
}
