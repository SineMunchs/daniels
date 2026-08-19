'use client'

import {useState} from 'react'
import styles from './CopyEmail.module.css'

export default function CopyEmail({email, className}: {email: string; className?: string}) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.button} ${className ?? ''}`}
      title="Klik for at kopiere e-mailadressen"
    >
      {copied ? 'Kopieret!' : email}
    </button>
  )
}
