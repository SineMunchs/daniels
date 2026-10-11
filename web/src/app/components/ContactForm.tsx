'use client'

import { useRef, useState } from 'react'
import { useActionState } from 'react'
import { sendContactForm, type ContactFormState } from '../actions/contact'
import styles from './ContactForm.module.css'

const MAX_FILES = 2
const MAX_TOTAL_BYTES = 5 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 1920
const IMAGE_QUALITY = 0.8

const initialState: ContactFormState = { status: 'idle' }

// Screenshots and phone photos routinely land at 5-15MB, well past MAX_TOTAL_BYTES.
// Downscale + re-encode as JPEG client-side so a normal screenshot fits comfortably.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', IMAGE_QUALITY),
    )
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.\w+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export default function ContactForm({title}: {title: string}) {
  const [state, formAction, pending] = useActionState(sendContactForm, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)

  const syncFileInput = (nextFiles: File[]) => {
    const dataTransfer = new DataTransfer()
    nextFiles.forEach((file) => dataTransfer.items.add(file))
    if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files
  }

  const handleFilesChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? [])
    event.target.value = ''

    if (files.length + chosen.length > MAX_FILES) {
      setFileError(`Du kan højst vedhæfte ${MAX_FILES} filer.`)
      return
    }

    setCompressing(true)
    const compressed = await Promise.all(chosen.map(compressImage))
    setCompressing(false)

    const merged = [...files, ...compressed]
    const totalSize = merged.reduce((sum, file) => sum + file.size, 0)

    if (totalSize > MAX_TOTAL_BYTES) {
      setFileError(
        `De valgte filer fylder for meget tilsammen, selv efter komprimering (max ${MAX_TOTAL_BYTES / (1024 * 1024)} MB).`,
      )
      return
    }

    setFileError(null)
    setFiles(merged)
    syncFileInput(merged)
  }

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    setFileError(null)
    setFiles(next)
    syncFileInput(next)
  }

  const handleCancel = () => {
    setFileError(null)
    setFiles([])
    syncFileInput([])
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{title}</h2>

      <form ref={formRef} action={formAction} className={styles.form}>
        <input
          className={styles.field}
          type="text"
          name="navn"
          placeholder="Navn*"
          required
        />

        <div className={`${styles.row} ${styles.rowEmail}`}>
          <input
            className={styles.field}
            type="email"
            name="email"
            placeholder="E-mail*"
            required
          />
          <input
            className={styles.field}
            type="tel"
            name="telefon"
            placeholder="Telefon*"
            required
          />
        </div>

        <div className={`${styles.row} ${styles.rowAddress}`}>
          <input
            className={styles.field}
            type="text"
            name="postnummer"
            placeholder="Postnummer*"
            required
          />
          <input className={styles.field} type="text" name="by" placeholder="By" />
        </div>

        <textarea
          className={styles.field}
          name="besked"
          placeholder="Skriv en besked*"
          required
        />

        <input
          ref={fileInputRef}
          type="file"
          name="files"
          multiple
          hidden
          onChange={handleFilesChosen}
        />
        <button
          type="button"
          className={styles.fileButton}
          disabled={compressing}
          onClick={() => fileInputRef.current?.click()}
        >
          {compressing ? 'Komprimerer...' : `Tilføj filer (max ${MAX_FILES})`}
        </button>

        {fileError && (
          <p className={`${styles.notice} ${styles.noticeError}`} aria-live="polite">
            {fileError}
          </p>
        )}

        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((file, index) => (
              <span className={styles.fileChip} key={`${file.name}-${index}`}>
                {file.name}
                <button
                  type="button"
                  className={styles.fileChipRemove}
                  aria-label={`Fjern ${file.name}`}
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button type="button" className={styles.cancelButton} onClick={handleCancel}>
          Anuller
        </button>

        <button type="submit" className={styles.submitButton} disabled={pending}>
          {pending ? 'Sender...' : 'Send'}
        </button>

        {state.status !== 'idle' && state.message && (
          <p
            className={`${styles.notice} ${
              state.status === 'success' ? styles.noticeSuccess : styles.noticeError
            }`}
            aria-live="polite"
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  )
}
