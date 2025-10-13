import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Part component
const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

// Content component
const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

// Header component
const Header = ({ courseName }) => (
  <h2>{courseName}</h2>
)
// Total component
const Total = ({ parts }) => (
  <p>
    total of {Array.isArray(parts) ? parts.reduce((sum, part) => sum + part.exercises, 0) : 0} exercises
  </p>
)

// Course component
const Course = ({ course }) => (
  <div>
    <Header courseName={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

function App() {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
