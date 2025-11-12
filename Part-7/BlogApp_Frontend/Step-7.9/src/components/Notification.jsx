
const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }
  let color = 'green'
  if (type === 'error' || (typeof message === 'string' && message.toLowerCase().includes('wrong'))) {
    color = 'red'
  }
  return (
    <div style={{
      border: '2px solid',
      padding: 10,
      marginBottom: 10,
      background: '#e9e5e5ff',
      fontSize: 18,
      color
    }}>
      {message}
    </div>
  )
}

export default Notification
