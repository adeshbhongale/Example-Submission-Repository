const Total = ({ parts = [] }) => {
  return (
    <strong>
      total of {Array.isArray(parts) ? parts.reduce((sum, part) => sum + part.exercises, 0) : 0} exercises
    </strong>
  )
}

export default Total