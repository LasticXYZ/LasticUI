import React, { createRef } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

//import Balances from './Balances'
//import Transfer from './Transfer'
//import Upgrade from './Upgrade'
import AccountSelector from './AccountSelector'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor2 from './Interactor2'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import GetConstants from './needed/GetConstants'
import GetExtrinsics from './needed/GetExtrinsics'
import { Query } from './needed/QueryTest'
import QueryRegions from './needed/QueryRegion'
import PurchaseInteractor from './needed/PurchaseInteract'
import TransferInteractor from './needed/TransferInteract'
import ConfigureInteractor from './needed/SudoConfigure'
import Interactor from './Interactor'
import RenewInteractor from './needed/RenewInteract'
import AssignInteractor from './needed/AssignInteract'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row>
            <ConfigureInteractor />
          </Grid.Row>
          <Grid.Row>
            <Interactor2 />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <PurchaseInteractor />
            <TransferInteractor />
          </Grid.Row>
          <Grid.Row>
            <RenewInteractor />
            <AssignInteractor />
          </Grid.Row>
          <Grid.Row stretched>
            <GetConstants />
            <GetExtrinsics />
          </Grid.Row>
          <Grid.Row>
            <Query />
          </Grid.Row>
          <Grid.Row>
            <QueryRegions />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule />
          </Grid.Row>
          <Grid.Row>
            <Interactor />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
