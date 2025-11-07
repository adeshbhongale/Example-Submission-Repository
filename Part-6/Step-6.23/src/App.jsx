import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { NotificationContext } from './NotificationContext.jsx'


const App = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SHOW', payload: `you voted '${updatedAnecdote.content}'` })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
