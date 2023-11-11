import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrateState } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';

function Transfer(props) {
  const [status, setStatus] = useState(null);

  // State for each field in the transaction
  const [begin, setBegin] = useState('');
  const [core, setCore] = useState('');
  const [mask, setMask] = useState('');
  const [task, setTask] = useState('');

  // Update functions for each field
  const handleBeginChange = (_, { value }) => setBegin(value);
  const handleCoreChange = (_, { value }) => setCore(value);
  const handleMaskChange = (_, { value }) => setMask(value);
  const handleTaskChange = (_, { value }) => setTask(value);

  return (
    <Grid.Column width={8}>
      <h3>Broker Pallet - Transfer Interaction</h3>
      <Form>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Region ID Begin</label>
            <Input
              fluid
              type="text"
              placeholder="Enter begin"
              value={begin}
              onChange={handleBeginChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Region ID Core</label>
            <Input
              fluid
              type="text"
              placeholder="Enter core"
              value={core}
              onChange={handleCoreChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Region ID Mask</label>
            <Input
              fluid
              type="text"
              placeholder="Enter mask"
              value={mask}
              onChange={handleMaskChange}
            />
          </Form.Field>
          <Form.Field>
            <label>NewOwner</label>
            <Input
              fluid
              type="text"
              placeholder="Enter New Owner"
              value={task}
              onChange={handleTaskChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Submit"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'broker',
              callable: 'transfer',
              inputParams: [{ begin, core, mask }, task],
              paramFields: [
                { name: 'regionId', type: 'Object', optional: true },
                { name: 'newOwner', type: 'String', optional: false },
              ],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function TransferInteractor(props) {
  const { api } = useSubstrateState();
  return api.tx.broker && api.tx.broker.transfer ? <Transfer {...props} /> : null;
}
