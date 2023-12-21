import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrateState } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';

function Renew(props) {
  const [status, setStatus] = useState(null);
  const [param, setParam] = useState('');

  const handleInputChange = (_, { value }) => setParam(value);

  return (
    <Grid.Column width={8}>
      <h3>Broker Pallet - Renew Interaction</h3>
      <Form>
        <Form.Field>
          <label>Core Nb.</label>
          <Input
            fluid
            type="text"
            placeholder="Enter core nb."
            value={param}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Submit"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'broker',
              callable: 'renew',
              inputParams: [param],
              paramFields: [{ name: 'param', type: 'TYPE', optional: false }],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function RenewInteractor(props) {
  const { api } = useSubstrateState();
  return api.tx.broker && api.tx.broker.renew ? <Renew {...props} /> : null;
}
