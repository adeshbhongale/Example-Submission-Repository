import { useState } from 'react'
import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (props.onCreate) {
      props.onCreate({
        content: content.inputProps.value,
        author: author.inputProps.value,
        info: info.inputProps.value,
        votes: 0
      })
    }
  }

  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...content.inputProps} />
        </div>
        <div>
          author
          <input name='author' {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input name='info' {...info.inputProps} />
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
