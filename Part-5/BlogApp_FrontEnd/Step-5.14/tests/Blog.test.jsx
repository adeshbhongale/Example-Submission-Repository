import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
    expect(screen.getByText(/Test Blog Title Test Author/)).toBeDefined()
    expect(screen.queryByText('http://testurl.com')).toBeNull()
    expect(screen.queryByText(/likes 5/)).toBeNull()
  })

  test('shows url and likes when view button is clicked', () => {
    render(<Blog blog={blog} />)
    const button = screen.getByText('view')
    fireEvent.click(button)
    expect(screen.getByText('http://testurl.com')).toBeDefined()
    expect(screen.getByText(/likes 5/)).toBeDefined()
  })
})
