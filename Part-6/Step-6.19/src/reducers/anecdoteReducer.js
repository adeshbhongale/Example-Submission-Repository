import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    voteAnecdote(state, action) {
      const updated = action.payload
      return state.map(anecdote =>
        anecdote.id === updated.id ? updated : anecdote
      )
    },
  },
})

const { addAnecdote, setAnecdotes, voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = { content, votes: 0 }
    const savedAnecdote = await anecdotesService.create(newAnecdote)
    dispatch(addAnecdote(savedAnecdote))
  }
}

export const voteAnecdoteAsync = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const savedAnecdote = await anecdotesService.update(anecdote.id, updatedAnecdote)
    dispatch(voteAnecdote(savedAnecdote))
  }
}

export default anecdoteSlice.reducer
