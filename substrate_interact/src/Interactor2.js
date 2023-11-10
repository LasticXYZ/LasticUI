import React, { useEffect, useState } from 'react'
import { Grid, Form, Dropdown, Input, Label } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxGroupButton } from './substrate-lib/components'

const argIsOptional = arg => arg.type.toString().startsWith('Option<')

function Main(props) {
  const { api, jsonrpc } = useSubstrateState()
  const [status, setStatus] = useState(null)

  const [interxType, setInterxType] = useState('EXTRINSIC')
  //const [palletRPCs, setPalletRPCs] = useState([])
  const [callables, setCallables] = useState([])
  const [paramFields, setParamFields] = useState([])

  const initFormState = {
    palletRpc: 'broker',
    callable: '',
    inputParams: [],
  }

  const [formState, setFormState] = useState(initFormState)
  const { palletRpc, callable, inputParams } = formState

  const updateCallables = () => {
    if (!api || palletRpc === '') {
      return
    }
    const callables = Object.keys(api.tx[palletRpc])
      .sort()
      .map(c => ({ key: c, value: c, text: c }))
    setCallables(callables)
  }

  const updateParamFields = () => {
    if (!api || palletRpc === '' || callable === '') {
      setParamFields([])
      return
    }

    let paramFields = []

    if (interxType === 'EXTRINSIC') {
      const metaArgs = api.tx[palletRpc][callable].meta.args

      if (metaArgs && metaArgs.length > 0) {
        paramFields = metaArgs.map(arg => ({
          name: arg.name.toString(),
          type: arg.type.toString(),
          optional: argIsOptional(arg),
        }))
      }
    }

    setParamFields(paramFields)
  }

  //useEffect(updatePalletRPCs, [api, interxType])
  useEffect(updateCallables, [api, interxType, palletRpc])
  useEffect(updateParamFields, [api, interxType, palletRpc, callable, jsonrpc])

  const onPalletCallableParamChange = (_, data) => {
    setFormState(formState => {
      let res
      const { state, value } = data
      if (typeof state === 'object') {
        // Input parameter updated
        const {
          ind,
          paramField: { type },
        } = state
        const inputParams = [...formState.inputParams]
        inputParams[ind] = { type, value }
        res = { ...formState, inputParams }
      } else if (state === 'palletRpc') {
        res = { ...formState, [state]: value, callable: '', inputParams: [] }
      } else if (state === 'callable') {
        res = { ...formState, [state]: value, inputParams: [] }
      }
      return res
    })
  }

  const onInterxTypeChange = (ev, data) => {
    setInterxType(data.value)
    // clear the formState
    setFormState(initFormState)
  }

  const getOptionalMsg = interxType =>
    interxType === 'RPC'
      ? 'Optional Parameter'
      : 'Leaving this field as blank will submit a NONE value'

  return (
    <Grid.Column width={8}>
      <h1>Broker Pallet Interactor</h1>
      <Form>
        <Form.Group style={{ overflowX: 'auto' }} inline>
          <label>Interaction Type</label>
          <Form.Radio
            label="Extrinsic"
            name="interxType"
            value="EXTRINSIC"
            checked={interxType === 'EXTRINSIC'}
            onChange={onInterxTypeChange}
          />
        </Form.Group>
        <Form.Field>
          <label>Pallet / RPC</label>
          <Input
            fluid
            readOnly
            value={palletRpc}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Callables"
            fluid
            label="Callable"
            onChange={onPalletCallableParamChange}
            search
            selection
            state="callable"
            value={callable}
            options={callables}
          />
        </Form.Field>
        {paramFields.map((paramField, ind) => (
          <Form.Field key={`${paramField.name}-${paramField.type}`}>
            <Input
              placeholder={paramField.type}
              fluid
              type="text"
              label={paramField.name}
              state={{ ind, paramField }}
              value={inputParams[ind] ? inputParams[ind].value : ''}
              onChange={onPalletCallableParamChange}
            />
            {paramField.optional ? (
              <Label
                basic
                pointing
                color="teal"
                content={getOptionalMsg(interxType)}
              />
            ) : null}
          </Form.Field>
        ))}
        <Form.Field style={{ textAlign: 'center' }}>
          <InteractorSubmit
            setStatus={setStatus}
            attrs={{
              interxType,
              palletRpc,
              callable,
              inputParams,
              paramFields,
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}

function InteractorSubmit(props) {
  const {
    attrs: { interxType },
  } = props
  if (interxType === 'EXTRINSIC') {
    return <TxGroupButton {...props} />
  }
}

export default function Interactor2(props) {
  const { api } = useSubstrateState()
  return api.tx ? <Main {...props} /> : null
}
