const Notification = ({ message }) => {
  if (!message) {
    return null
  }
return (
    <div style={{
        border: '2px solid',
        padding: 10,
        marginBottom: 10,
        background: '#e9e5e5ff',
        fontSize: 18,
        color: message.toLowerCase().includes('wrong') ? 'red' : 'green'
    }}>
        {message}
    </div>
)
}

export default Notification
