const Content = ({ parts = [] }) => {
  return (
    <div>
      {parts && parts.length > 0 ? (
        parts.map((part, idx) => (
          <div key={part.id ?? idx}>
            {part.name} {part.exercises}
          </div>
        ))
      ) : (
        <div>No content available.</div>
      )}
    </div>
  )
}

export default Content