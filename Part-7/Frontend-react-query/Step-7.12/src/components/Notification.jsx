import { useNotification } from '../context/NotificationContext'

const Notification = () => {
  const notification = useNotification()
  if (notification === null) {
    return null
  }

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 10,
    fontcolor: 'black',
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 10,
    marginBottom: 15,
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification