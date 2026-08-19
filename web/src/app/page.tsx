import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {client, urlFor} from '@/sanity/client'
import type {SanityImageSource} from '@sanity/image-url'
import CopyEmail from './components/CopyEmail'
import styles from './page.module.css'

export const revalidate = 0

type Section = {
  _key: string
  title?: string
  slug?: {current?: string}
  body?: PortableTextBlock[]
  images?: SanityImageSource[]
  imagePosition?: 'left' | 'right'
}

const bodyComponents: PortableTextComponents = {
  block: {
    small: ({children}) => <p className={styles.textSmall}>{children}</p>,
    large: ({children}) => <p className={styles.textLarge}>{children}</p>,
    xlarge: ({children}) => <p className={styles.textXLarge}>{children}</p>,
  },
}

type Frontpage = {
  sections?: Section[]
}

type Kontakt = {
  heading?: string
  navn?: string
  cvr?: string
  email?: string
  linkedin?: string
}

function SectionBlock({section, index}: {section: Section; index: number}) {
  const images = section.images ?? []
  const imagePosition = section.imagePosition ?? 'left'
  const Heading = index === 0 ? 'h1' : 'h2'

  const imageBox = (image: SanityImageSource, key: number) => (
    <div className={styles.imageBox} key={key}>
      <Image
        src={urlFor(image).width(700).height(700).url()}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
      />
    </div>
  )

  const imageCell = (
    <div className={`${styles.cell} ${styles.imageArea}`}>
      {images.length > 1 ? (
        <div className={styles.imageGrid}>
          {images.map((image, i) => imageBox(image, i))}
        </div>
      ) : (
        images.length === 1 && imageBox(images[0], 0)
      )}
    </div>
  )

  const textCell = (
    <div className={`${styles.cell} ${styles.heading} ${styles.paragraph}`}>
      {section.title && <Heading>{section.title}</Heading>}
      {section.body && section.body.length > 0 && (
        <PortableText value={section.body} components={bodyComponents} />
      )}
    </div>
  )

  return (
    <section id={section.slug?.current?.trim()} className={styles.bento}>
      {imagePosition === 'right' ? (
        <>
          {textCell}
          {imageCell}
        </>
      ) : (
        <>
          {imageCell}
          {textCell}
        </>
      )}
    </section>
  )
}

export default async function Home() {
  const frontpage = await client.fetch<Frontpage | null>(
    `*[_type == "frontpage"][0]{sections[]{_key, title, slug, body, images, imagePosition}}`,
  )
  const kontakt = await client.fetch<Kontakt | null>(
    `*[_type == "kontakt"][0]{heading, navn, cvr, email, linkedin}`,
  )

  const sections = (frontpage?.sections ?? []).filter(
    (section) => section.title?.trim().toLowerCase() !== 'kontakt',
  )

  return (
    <div className={styles.page}>
      {sections.map((section, i) => (
        <SectionBlock key={section._key} section={section} index={i} />
      ))}

      <section id="kontakt" className={styles.contactSection}>
        <div className={styles.projectsHeading}>
          <h2>{kontakt?.heading || 'Kontakt'}</h2>
        </div>
        <div className={styles.paragraph}>
          {kontakt?.navn && <p>{kontakt.navn}</p>}
          {kontakt?.cvr && <p>CVR: {kontakt.cvr}</p>}
          {kontakt?.email && (
            <p>
              <CopyEmail email={kontakt.email} />
            </p>
          )}
          {kontakt?.linkedin && (
            <p>
              <a href={kontakt.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
