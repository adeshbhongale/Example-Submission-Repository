import { useContext } from 'react'
import { NotificationContext } from '../NotificationContext.jsx'

const Notification = () => {
  const [notification] = useContext(NotificationContext)

  if (!notification) return null

  const style = {
    border: '2px solid',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: notification.includes('too short')
      ? '#ffe5e5' // light red background for error
      : '#e6ffe6', // light green for success
    color: notification.includes('too short') ? '#d8000c' : '#007500',
    borderColor: notification.includes('too short') ? '#d8000c' : '#007500',
    transition: 'opacity 0.3s ease',
  }

  return <div style={style}>{notification}</div>
}

export default Notification
