const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div style={{
      border: '2px solid balck',
      padding: 10,
      margin: 10,
      color: 'black',
      background: '#b1dad4ff',
      fontWeight: 'bold',
      fontSize: 18
    }}>
      {message}
    </div>
  )
}

export default Notification
