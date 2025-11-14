import { createContext, useReducer, useContext } from 'react'

const UserContext = createContext()

export const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const [user] = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const [, dispatch] = useContext(UserContext)
  return dispatch
}

export default UserContext
