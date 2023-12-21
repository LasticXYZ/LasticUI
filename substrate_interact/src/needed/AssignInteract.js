import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrateState } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';

function Assign(props) {
  const [status, setStatus] = useState(null);

  // State for each field in the transaction
  const [begin, setBegin] = useState('');
  const [core, setCore] = useState('');
  const [mask, setMask] = useState('');
  const [task, setTask] = useState('');
  const [finality, setFinality] = useState('');

  // Update functions for each field
  const handleBeginChange = (_, { value }) => setBegin(value);
  const handleCoreChange = (_, { value }) => setCore(value);
  const handleMaskChange = (_, { value }) => setMask(value);
  const handleTaskChange = (_, { value }) => setTask(value);
  const handleFinalityChange = (_, { value }) => setFinality(value);

  return (
    <Grid.Column width={8}>
      <h3>Broker Pallet - Assign Interaction</h3>
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
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Task</label>
            <Input
              fluid
              type="text"
              placeholder="Enter Task"
              value={task}
              onChange={handleTaskChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Finality</label>
            <Input
              fluid
              type="text"
              placeholder="Enter Finality"
              value={finality}
              onChange={handleFinalityChange}
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
              callable: 'assign',
              inputParams: [{ begin, core, mask }, task, finality],
              paramFields: [
                { name: 'regionId', type: 'Object', optional: true },
                { name: 'task', type: 'u32', optional: false },
                { name: 'finality', type: 'PalletBrokerFinality', optional: false },
              ],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function AssignInteractor(props) {
  const { api } = useSubstrateState();
  return api.tx.broker && api.tx.broker.assign ? <Assign {...props} /> : null;
}
