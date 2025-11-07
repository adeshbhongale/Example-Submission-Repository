import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { createAnecdote } from '../requests'
import { NotificationContext } from '../NotificationContext.jsx'


const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (createdAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SHOW', payload: `you created '${createdAnecdote.content}'` })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
