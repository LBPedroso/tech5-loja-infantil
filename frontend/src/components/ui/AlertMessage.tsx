import React from 'react'

interface AlertMessageProps {
  type: 'error' | 'success'
  message: string
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  if (!message) return null
  return <div className={type}>{message}</div>
}

export default AlertMessage
