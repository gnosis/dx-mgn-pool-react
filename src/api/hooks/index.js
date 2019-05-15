import { useEffect, useState } from 'react'

export const useAppOnlineStatusInterval = () => {
  const [online, setOnline] = useState(window.navigator.onLine)

  useEffect(() => {
    const interval = setInterval(() => setOnline(window.navigator.onLine), 4000)

    return () => clearInterval(interval)
  }, [window.navigator.onLine])

  return online
}

export const useAppOnlineStatusListener = () => {
  const [online, setOnline] = useState(window.navigator.onLine)

  useEffect(() => {
    const onlineListener = window.addEventListener('online', () => setOnline(true))
    const offlineListener = window.addEventListener('offline', () => setOnline(false))

    return () => {
      window.removeEventListener('online', onlineListener)
      window.removeEventListener('offline', offlineListener)
    }
  }, [online])

  return online
}
