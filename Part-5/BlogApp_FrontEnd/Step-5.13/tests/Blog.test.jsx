import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { username: 'mluukkai', name: 'Matti Luukkainen' }
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} />)
    // Title and author should be visible
    const summary = screen.getByText(/Test Blog Title Test Author/)
    expect(summary).toBeDefined()
    // URL and likes should not be in the document
    const url = screen.queryByText('http://testurl.com')
    expect(url).toBeNull()
    const likes = screen.queryByText(/likes 5/)
    expect(likes).toBeNull()
  })
})
