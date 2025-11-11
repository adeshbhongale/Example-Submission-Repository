import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from '../src/components/BlogForm'

test('calls onSubmit with correct details when a new blog is created', async () => {
  const createBlog = vi.fn().mockResolvedValue(true)
  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText(/title:/i)
  const authorInput = screen.getByLabelText(/author:/i)
  const urlInput = screen.getByLabelText(/url:/i)
  const createButton = screen.getByText('create')

  await fireEvent.change(titleInput, { target: { value: 'Test Blog' } })
  await fireEvent.change(authorInput, { target: { value: 'Test Author' } })
  await fireEvent.change(urlInput, { target: { value: 'http://testurl.com' } })
  await fireEvent.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com'
  })
})
