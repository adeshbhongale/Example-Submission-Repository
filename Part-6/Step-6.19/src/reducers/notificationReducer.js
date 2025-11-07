import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'render here notification...',
  reducers: {
    setNotificationText(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

const { setNotificationText, clearNotification } = notificationSlice.actions

// Unified action creator: setNotification(message, seconds)
export const setNotification = (message, seconds = 5) => {
  return async dispatch => {
    dispatch(setNotificationText(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
