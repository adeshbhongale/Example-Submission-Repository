import { useState } from 'react'

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
]

const initialVotes = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7:0 }

const App = () => {
  const [selected, setSelected] = useState(5)
  const [votes, setVotes] = useState(initialVotes)

  const handleVote = () => {
    const copy = { ...votes }
    copy[selected] = (copy[selected] || 0) + 1
    setVotes(copy)
  }

  const handleNext = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const maxVotes = Math.max(...Object.values(votes), 0)
  const mostVotedIndex = Object.keys(votes).reduce((maxIdx, idx) => 
    votes[idx] > (votes[maxIdx] || 0) ? idx : maxIdx, 0
  )

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>
      <h2>Anecdote with most votes</h2>
      <div>{anecdotes[mostVotedIndex]}</div>
      <div>has {votes[mostVotedIndex] || 0} votes</div>
    </div>
  )
}

export default App
