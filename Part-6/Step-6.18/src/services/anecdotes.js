const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  console.log('Fetching all anecdotes from backend...')
  const response = await fetch(baseUrl)
  if (!response.ok) throw new Error('Failed to fetch anecdotes')
  return await response.json()
}

const create = async (anecdote) => {
  console.log('Creating new anecdote:', anecdote)
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  })
  if (!response.ok) throw new Error('Failed to create anecdote')
  return await response.json()
}

const update = async (id, updatedAnecdote) => {
  console.log(`Updating anecdote ${id}:`, updatedAnecdote)
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  })
  if (!response.ok) throw new Error('Failed to update anecdote')
  return await response.json()
}

export default { getAll, create, update }
