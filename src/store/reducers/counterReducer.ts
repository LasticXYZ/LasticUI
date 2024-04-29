// store/reducers/counterReducer.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => {
      state.value += 1
    },
    decremented: (state) => {
      state.value -= 1
    },
  },
})

export const { incremented, decremented } = counterSlice.actions
export default counterSlice.reducer
