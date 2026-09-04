import {client} from '@/sanity/client'
import CopyEmail from './CopyEmail'
import styles from './Footer.module.css'

type KontaktLink = {label?: string; url?: string}

type Kontakt = {
  heading?: string
  connectHeading?: string
  navn?: string
  cvr?: string
  email?: string
  links?: KontaktLink[]
}

export default async function Footer() {
  const kontakt = await client.fetch<Kontakt | null>(
    `*[_type == "kontakt"][0]{heading, connectHeading, navn, cvr, email, links}`,
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
              <CopyEmail email={kontakt.email} />
            </p>
          )}
        </div>

        <div className={styles.colRight}>
          <h3>{kontakt?.connectHeading || 'Connect'}</h3>
          {kontakt?.links?.map(
            (link, i) =>
              link.url && (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
              ),
          )}
        </div>
      </div>

      <div className={styles.credit}>
        <a href="https://sinemunch.com" target="_blank" rel="noopener noreferrer">
          Website by S. Munch
        </a>
        <span>© {year} Artisan Entreprise</span>
      </div>
    </footer>
  )
}
