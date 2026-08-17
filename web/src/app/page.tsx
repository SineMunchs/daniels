import Image from 'next/image'
import {client, urlFor} from '@/sanity/client'
import type {SanityImageSource} from '@sanity/image-url'
import styles from './page.module.css'

export const revalidate = 0

type Section = {
  _key: string
  title?: string
  slug?: {current?: string}
  body?: string
  images?: SanityImageSource[]
  imagePosition?: 'left' | 'right'
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
  const paragraphs =
    section.body?.split('\n').map((line) => line.trim()).filter(Boolean) ?? []
  const images = section.images ?? []
  const imagePosition = section.imagePosition ?? 'left'
  const Heading = index === 0 ? 'h1' : 'h2'

  const imageBox = (image: SanityImageSource, key: number) => (
    <div className={styles.imageBox} key={key}>
      <Image
        src={urlFor(image).width(700).height(700).url()}
        alt=""
        fill
        sizes="(max-width: 980px) 50vw, 350px"
      />
    </div>
  )

  const imageBoxes =
    images.length === 1
      ? imagePosition === 'right'
        ? [<div key="blank" />, imageBox(images[0], 0)]
        : [imageBox(images[0], 0), <div key="blank" />]
      : images.map((image, i) => imageBox(image, i))

  const imageArea = (
    <div className={`${styles.cell} ${styles.spanTwo} ${styles.imageArea}`}>
      {images.length > 0 && <div className={styles.imageGrid}>{imageBoxes}</div>}
    </div>
  )
  const decorativeCell = <div className={`${styles.cell} ${styles.decorative}`} />

  return (
    <section id={section.slug?.current} className={styles.bento}>
      <div className={`${styles.cell} ${styles.spanTwo} ${styles.heading}`}>
        {section.title && <Heading>{section.title}</Heading>}
      </div>
      {decorativeCell}
      {decorativeCell}

      {imagePosition === 'right' ? (
        <>
          {decorativeCell}
          {decorativeCell}
          {imageArea}
        </>
      ) : (
        <>
          {imageArea}
          {decorativeCell}
          {decorativeCell}
        </>
      )}

      {decorativeCell}
      <div className={`${styles.cell} ${styles.spanTwo} ${styles.paragraph}`}>
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {decorativeCell}
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

      <section id="kontakt" className={styles.bento}>
        <div className={`${styles.cell} ${styles.spanAll} ${styles.projectsHeading}`}>
          <h2>{kontakt?.heading || 'Kontakt'}</h2>
        </div>

        <div className={`${styles.cell} ${styles.decorative}`} />
        <div className={`${styles.cell} ${styles.spanTwo} ${styles.paragraph}`}>
          {kontakt?.navn && <p>{kontakt.navn}</p>}
          {kontakt?.cvr && <p>CVR: {kontakt.cvr}</p>}
          {kontakt?.email && (
            <p>
              <a href={`mailto:${kontakt.email}`}>{kontakt.email}</a>
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
        <div className={`${styles.cell} ${styles.decorative}`} />
      </section>
    </div>
  )
}
