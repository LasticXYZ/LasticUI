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

import AccountSelector from './AccountSelector'
//import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor2 from './Interactor2'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
//import Transfer from './Transfer'
//import Upgrade from './Upgrade'
import GetConstants from './needed/GetConstants'
import GetExtrinsics from './needed/GetExtrinsics'
import QuerySaleInfo from './needed/QuerySaleInfo'
import QueryConfiguration from './needed/QueryConfiguration'
import QueryLeases from './needed/QueryLeases'
import QueryPalletVersion from './needed/QueryPalletVersion'
import QueryReservations from './needed/QueryReservations'
import QueryStatus from './needed/QueryStatus'


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
          {/*
          <Grid.Row stretched>
            <Balances />
          </Grid.Row>
          <Grid.Row>
            <Transfer />
            <Upgrade />
          </Grid.Row>
          */}
          <Grid.Row>
            <Interactor2 />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <GetConstants />
          </Grid.Row>
          <Grid.Row>
            <GetExtrinsics />
          </Grid.Row>
          <Grid.Row>
            <QuerySaleInfo />
          </Grid.Row>
          <Grid.Row>
            <QueryConfiguration />
          </Grid.Row>
          <Grid.Row>
            <QueryLeases />
          </Grid.Row>
          <Grid.Row>
            <QueryPalletVersion /> 
          </Grid.Row>
          <Grid.Row>
            <QueryReservations /> 
          </Grid.Row>
          <Grid.Row>
            <QueryStatus /> 
          </Grid.Row>
          <Grid.Row>
            <TemplateModule />
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
