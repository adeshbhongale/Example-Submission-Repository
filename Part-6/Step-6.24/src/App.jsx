import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { NotificationContext } from './NotificationContext.jsx'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, dispatch] = useContext(NotificationContext)

  // --- Mutation for voting ---
  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'SHOW',
        payload: `You voted '${updatedAnecdote.content}' 👍`,
      })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    },
    onError: () => {
      dispatch({
        type: 'SHOW',
        payload: 'Failed to update vote. Please try again later.',
      })
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000)
    },
  })

  // --- Query for anecdotes ---
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return (
      <div>
        Anecdote service not available due to problems in the server.
      </div>
    )
  }

  const anecdotes = result.data

  // --- Voting handler ---
  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h2>Anecdote App</h2>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{
            marginBottom: 10,
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 6,
            backgroundColor: '#fafafa',
          }}
        >
          <div>{anecdote.content}</div>
          <div style={{ marginTop: 5 }}>
            has {anecdote.votes}{' '}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
