const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div style={{
      border: '2px solid balck',
      padding: 10,
      margin: 10,
      color: 'black',
      background: '#9ce2cbff',
      fontWeight: 'bold',
      fontSize: 18
    }}>
      {message}
    </div>
  )
}

export default Notification
