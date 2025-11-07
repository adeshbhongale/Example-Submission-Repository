import ReactDOM from 'react-dom/client'


import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

// initialize store data via thunk
store.dispatch(initializeAnecdotes())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
