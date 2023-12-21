import React, { useEffect, useState } from 'react'
import { Feed, Grid, Button } from 'semantic-ui-react'
import { useSubstrateState } from './substrate-lib'

const FILTERED_EVENTS = [
  'system:ExtrinsicSuccess::(phase={"applyExtrinsic":0})',
  'broker:HistoryInitialized::(phase={"initialize":0})',
]

const eventName = ev => `${ev.section}:${ev.method}`
const eventParams = ev => JSON.stringify(ev.data)

function Main(props) {
  const { api } = useSubstrateState()
  const [eventFeed, setEventFeed] = useState([])
  const [historyInitEvents, setHistoryInitEvents] = useState([]) // New state for broker:HistoryInitialized events

  useEffect(() => {
    let unsub = null
    let keyNum = 0
    const allEvents = async () => {
      unsub = await api.query.system.events(events => {
        events.forEach(record => {
          const { event, phase } = record
          const evHuman = event.toHuman()
          const evName = eventName(evHuman)
          const evParams = eventParams(evHuman)
          const evNamePhase = `${evName}::(phase=${phase.toString()})`

          if (FILTERED_EVENTS.includes(evNamePhase)) return

          // Check if the event is broker:HistoryInitialized
          if (evName === 'broker:HistoryInitialized') {
            setHistoryInitEvents(e => [
              { key: keyNum, summary: evName, content: evParams },
              ...e,
            ])
          } else {
            setEventFeed(e => [
              { key: keyNum, icon: 'bell', summary: evName, content: evParams },
              ...e,
            ])
          }

          keyNum += 1
        })
      })
    }

    allEvents()
    return () => unsub && unsub()
  }, [api.query.system])

  const { feedMaxHeight = 250 } = props

  return (
    <Grid.Column width={8}>
      <h1 style={{ float: 'left' }}>Events</h1>
      <Button
        basic
        circular
        size="mini"
        color="grey"
        floated="right"
        icon="erase"
        onClick={_ => {
          setEventFeed([])
          setHistoryInitEvents([]) // Clear broker:HistoryInitialized events
        }}
      />
      <Feed
        style={{ clear: 'both', overflow: 'auto', maxHeight: feedMaxHeight }}
        events={eventFeed}
      />
      <h2>History Initialized Events</h2>
      <Feed
        style={{ overflow: 'auto', maxHeight: feedMaxHeight }}
        events={historyInitEvents}
      />
    </Grid.Column>
  )
}

export default function Events(props) {
  const { api } = useSubstrateState()
  return api.query && api.query.system && api.query.system.events ? (
    <Main {...props} />
  ) : null
}
