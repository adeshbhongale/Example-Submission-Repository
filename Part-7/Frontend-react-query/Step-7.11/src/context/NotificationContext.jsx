import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={{ notification, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const { notification } = useContext(NotificationContext)
  return notification
}

export const useNotify = () => {
  const { dispatch } = useContext(NotificationContext)
  return (message, type) => dispatch({ type: "SET", payload: { message, type } })
}

export const useClear = () => {
  const { dispatch } = useContext(NotificationContext)
  return () => dispatch({ type: "CLEAR" })
}

export default NotificationContext
