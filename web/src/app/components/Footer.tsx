import {client} from '@/sanity/client'
import styles from './Footer.module.css'

type Kontakt = {
  heading?: string
  connectHeading?: string
  navn?: string
  cvr?: string
  email?: string
  linkedin?: string
}

export default async function Footer() {
  const kontakt = await client.fetch<Kontakt | null>(
    `*[_type == "kontakt"][0]{heading, connectHeading, navn, cvr, email, linkedin}`,
  )
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <hr className={styles.divider} />

      <div className={styles.top}>
        <div className={styles.col}>
          <h3>{kontakt?.heading || 'Kontakt'}</h3>
          {kontakt?.navn && <p>{kontakt.navn}</p>}
          {kontakt?.cvr && <p>CVR: {kontakt.cvr}</p>}
          {kontakt?.email && (
            <p>
              <a href={`mailto:${kontakt.email}`}>{kontakt.email}</a>
            </p>
          )}
        </div>

        <div className={styles.colRight}>
          <h3>{kontakt?.connectHeading || 'Connect'}</h3>
          {kontakt?.linkedin && (
            <a href={kontakt.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <div className={styles.credit}>
        <a href="https://sinemunch.com" target="_blank" rel="noopener noreferrer">
          Website by S. Munch
        </a>
        <span>© {year} Artisan Enterprise</span>
      </div>
    </footer>
  )
}
