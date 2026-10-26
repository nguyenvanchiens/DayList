import { useEffect, useState } from 'react'
import Icon from './Icon'
import { useLocalStorage } from '../hooks/useLocalStorage'

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

export default function InstallBanner() {
  const [promptEvent, setPromptEvent] = useState(null)
  const [installed, setInstalled] = useState(isStandalone)
  const [dismissed, setDismissed] = useLocalStorage('todolife.installDismissed', false)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setPromptEvent(e)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || dismissed || (!promptEvent && !isIOS())) return null

  const install = async () => {
    promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPromptEvent(null)
  }

  return (
    <div className="install">
      <img src="/pwa-64x64.png" alt="" width="36" height="36" />
      <p>
        {promptEvent ? (
          'Cài ToDoLife lên màn hình chính để mở nhanh và dùng khi không có mạng.'
        ) : (
          <>
            Cài lên iPhone: bấm <Icon name="share" size={13} /> rồi chọn “Thêm vào MH chính”.
          </>
        )}
      </p>
      {promptEvent && (
        <button className="btn small primary" onClick={install}>
          <Icon name="download" size={15} />
          Cài đặt
        </button>
      )}
      <button className="icon-btn" onClick={() => setDismissed(true)} aria-label="Ẩn gợi ý cài đặt">
        <Icon name="x" size={15} />
      </button>
    </div>
  )
}
