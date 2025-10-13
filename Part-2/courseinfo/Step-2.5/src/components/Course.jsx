import React from 'react';
import Header from './Header';
import Content from './Content';
import Total from './Total';

const Course = ({ courses }) => {
  return (
    <>
      {courses.map(course => (
        <section key={course.id}>
          <Header course={course} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </section>
      ))}
    </>
  )
}

export default Course;