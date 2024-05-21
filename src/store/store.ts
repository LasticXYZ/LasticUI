// store/store.js
import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import counterReducer from './reducers/counterReducer'

const makeStore = () =>
  configureStore({
    reducer: {
      // Add your reducers here
      counter: counterReducer,
    },
    // Enable Redux DevTools
    devTools: process.env.NODE_ENV !== 'production',
  })

export const wrapper = createWrapper(makeStore)
