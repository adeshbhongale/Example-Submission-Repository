import { useNotification } from '../context/NotificationContext'

const Notification = () => {
  const notification = useNotification()
  if (notification === null) {
    return null
  }

  // Check if notification is a string or an object
  const message = typeof notification === 'string' ? notification : notification.message
  const type = typeof notification === 'string' ? 'success' : notification.type

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
