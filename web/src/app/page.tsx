import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {client, urlFor} from '@/sanity/client'
import type {SanityImageSource} from '@sanity/image-url'
import CopyEmail from './components/CopyEmail'
import ContactForm from './components/ContactForm'
import styles from './page.module.css'

export const revalidate = 0

type ImageElement = SanityImageSource & {
  _key: string
  _type: 'billedeElement'
  asset?: {_ref: string}
  banner?: boolean
  alt?: string
  visning?: 'kvadratisk' | 'fuld'
}
type TekstElement = {
  _key: string
  _type: 'tekstElement'
  body?: PortableTextBlock[]
  centreret?: boolean
  baggrund?: boolean
  kontaktKnapper?: boolean
}
type BilledeTekstBlokElement = {
  _key: string
  _type: 'billedeTekstBlok'
  billede?: SanityImageSource & {
    asset?: {_ref: string}
    alt?: string
    visning?: 'kvadratisk' | 'fuld'
  }
  tekst?: PortableTextBlock[]
  billedePosition?: 'left' | 'right'
  kontaktKnapper?: boolean
}
type KontaktformularFeltElement = {
  _key: string
  _type: 'kontaktformularFelt'
  heading?: string
  recipientEmail?: string
}
type KontaktformularTekstBlokElement = {
  _key: string
  _type: 'kontaktformularTekstBlok'
  kontaktfelt?: {heading?: string; recipientEmail?: string}
  tekst?: PortableTextBlock[]
  kontaktfeltPosition?: 'left' | 'right'
  kontaktKnapper?: boolean
}
type KontaktSektionElement = {_key: string; _type: 'kontaktSektion'}
type Anbefaling = {
  _key: string
  titel?: string
  tekst?: string
  stjerner?: number
}
type AnbefalingerBlokElement = {
  _key: string
  _type: 'anbefalingerBlok'
  anbefalinger?: Anbefaling[]
}
type GalleriBillede = SanityImageSource & {_key: string; asset?: {_ref: string}; alt?: string}
type BilledeGalleriBlokElement = {
  _key: string
  _type: 'billedeGalleriBlok'
  billeder?: GalleriBillede[]
}
type SectionElement =
  | ImageElement
  | TekstElement
  | BilledeTekstBlokElement
  | KontaktformularFeltElement
  | KontaktformularTekstBlokElement
  | KontaktSektionElement
  | AnbefalingerBlokElement
  | BilledeGalleriBlokElement

type Section = {
  _key: string
  _type: 'section' | 'kontaktformular' | 'kontaktSektion'
  title?: string
  slug?: {current?: string}
  elementer?: SectionElement[]
  imagePosition?: 'left' | 'right'
  position?: 'left' | 'right'
  recipientEmail?: string
}

// Sanity image asset refs encode their pixel dimensions, e.g.
// "image-<hash>-3024x4032-jpg", so the aspect ratio can be read
// without an extra dereferencing query.
function getImageAspectRatio(source?: {asset?: {_ref?: string}}): number | undefined {
  const match = source?.asset?._ref?.match(/-(\d+)x(\d+)-/)
  if (!match) return undefined
  const width = Number(match[1])
  const height = Number(match[2])
  return width && height ? width / height : undefined
}

const bodyComponents: PortableTextComponents = {
  block: {
    h1: ({children}) => <h1 className={styles.textXLarge}>{children}</h1>,
    h2: ({children}) => <h2 className={styles.textLarge}>{children}</h2>,
    small: ({children}) => <p className={styles.textSmall}>{children}</p>,
    large: ({children}) => <p className={styles.textLarge}>{children}</p>,
    xlarge: ({children}) => <p className={styles.textXLarge}>{children}</p>,
  },
  marks: {
    link: ({value, children}) => {
      const target = value?.blank ? '_blank' : undefined
      return (
        <a href={value?.href} target={target} rel={target ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      )
    },
  },
}

type Frontpage = {
  sections?: Section[]
}

type KontaktLink = {label?: string; url?: string}

type Kontakt = {
  heading?: string
  navn?: string
  cvr?: string
  email?: string
  telefon?: string
  links?: KontaktLink[]
}

function KontaktKnapper({kontakt}: {kontakt: Kontakt | null}) {
  if (!kontakt?.email && !kontakt?.telefon) return null

  return (
    <div className={styles.knapper}>
      {kontakt?.email && (
        <a href={`mailto:${kontakt.email}`} className={styles.knapKontakt}>
          Kontakt
        </a>
      )}
      {kontakt?.telefon && (
        <a href={`tel:${kontakt.telefon.replace(/\s+/g, '')}`} className={styles.knapRing}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {kontakt.telefon}
        </a>
      )}
    </div>
  )
}

function ContactFormSection({section}: {section: Section}) {
  const position = section.position ?? 'right'

  const formCell = (
    <div className={`${styles.cell} ${styles.contactCell}`}>
      <ContactForm
        title={section.title || 'Få et uforpligtende tilbud'}
        recipientEmail={section.recipientEmail || 'tjekforrod@gmail.com'}
      />
    </div>
  )
  const emptyCell = <div className={`${styles.cell} ${styles.emptyCell}`} aria-hidden="true" />

  return (
    <section id={section.slug?.current?.trim()} className={styles.bento}>
      {position === 'left' ? (
        <>
          {formCell}
          {emptyCell}
        </>
      ) : (
        <>
          {emptyCell}
          {formCell}
        </>
      )}
    </section>
  )
}

function KontaktInfo({kontakt}: {kontakt: Kontakt | null}) {
  return (
    <>
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
        {kontakt?.links?.map(
          (link, i) =>
            link.url && (
              <p key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
              </p>
            ),
        )}
      </div>
    </>
  )
}

function Stars({value}: {value?: number}) {
  const filled = Math.max(0, Math.min(5, value ?? 0))
  return (
    <div className={styles.stjerner} aria-label={`${filled} ud af 5 stjerner`}>
      {Array.from({length: 5}).map((_, i) => (
        <svg
          key={i}
          className={i < filled ? styles.stjerneFyldt : styles.stjerneTom}
          viewBox="0 0 20 20"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path
            d="M10 1.5l2.59 5.25 5.79.84-4.19 4.09.99 5.77L10 14.9l-5.18 2.55.99-5.77-4.19-4.09 5.79-.84z"
            fill={i < filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

function AnbefalingerSection({element}: {element: AnbefalingerBlokElement}) {
  const items = element.anbefalinger ?? []
  if (items.length === 0) return null

  const layoutClass =
    items.length === 1
      ? styles.anbefalingerSingle
      : items.length === 2
        ? styles.anbefalingerHalf
        : items.length === 3
          ? styles.anbefalingerCenter
          : styles.anbefalingerScroll

  return (
    <div className={styles.anbefalingerWrap}>
      <div className={`${styles.anbefalinger} ${layoutClass}`}>
        {items.map((item) => (
          <div className={styles.anbefalingCard} key={item._key}>
            {item.titel && <h3>{item.titel}</h3>}
            {item.tekst && <p>{item.tekst}</p>}
            <Stars value={item.stjerner} />
          </div>
        ))}
      </div>
    </div>
  )
}

function BilledeGalleriSection({element}: {element: BilledeGalleriBlokElement}) {
  const billeder = element.billeder ?? []
  if (billeder.length === 0) return null

  return (
    <div className={styles.galleriWrap}>
      <div className={styles.galleri}>
        {billeder.map((billede) => (
          <div className={styles.galleriItem} key={billede._key}>
            {billede.asset?._ref && (
              <Image
                src={urlFor(billede).width(700).height(700).url()}
                alt={billede.alt || ''}
                fill
                sizes="(max-width: 640px) 85vw, 33vw"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function KontaktSection({kontakt}: {kontakt: Kontakt | null}) {
  return (
    <section id="kontakt" className={styles.contactSection}>
      <KontaktInfo kontakt={kontakt} />
    </section>
  )
}

function SectionBlock({section, kontakt}: {section: Section; kontakt: Kontakt | null}) {
  const elementer = section.elementer ?? []
  const startSide = section.imagePosition ?? 'left'

  const renderElement = (element: SectionElement) => {
    if (element._type === 'billedeElement') {
      const fuld = element.visning === 'fuld'
      const image = fuld ? urlFor(element).width(1000) : urlFor(element).width(700).height(700)
      return (
        <div className={styles.imageBox}>
          {element.asset?._ref && (
            <Image
              src={image.url()}
              alt={element.alt || ''}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          )}
        </div>
      )
    }
    if (element._type === 'tekstElement') {
      return (
        <>
          {element.body && element.body.length > 0 && (
            <PortableText value={element.body} components={bodyComponents} />
          )}
          {element.kontaktKnapper && <KontaktKnapper kontakt={kontakt} />}
        </>
      )
    }
    if (element._type === 'kontaktformularFelt') {
      return (
        <ContactForm
          title={element.heading || 'Få et uforpligtende tilbud'}
          recipientEmail={element.recipientEmail || 'tjekforrod@gmail.com'}
        />
      )
    }
    return <KontaktInfo kontakt={kontakt} />
  }

  const cellClass = (element: SectionElement) => {
    if (element._type === 'billedeElement') return styles.imageArea
    if (element._type === 'tekstElement') return styles.paragraph
    return styles.contactCell
  }

  const cellStyle = (element: SectionElement) => {
    if (element._type === 'billedeElement' && element.visning === 'fuld') {
      const ratio = getImageAspectRatio(element)
      // Grid rows stretch cells to match height by default, which would
      // override the aspect-ratio below and crop the image again.
      return ratio ? {aspectRatio: ratio, alignSelf: 'start' as const} : undefined
    }
    return undefined
  }

  const elementCell = (element: SectionElement) => (
    <div className={`${styles.cell} ${cellClass(element)}`} style={cellStyle(element)}>
      {renderElement(element)}
    </div>
  )

  const emptyCell = <div className={`${styles.cell} ${styles.emptyCell}`} aria-hidden="true" />

  // A "billede og tekst" or "kontaktformular og tekst" block always forms its
  // own row, with the image/form on whichever side it was given, independent
  // of the section's alternation.
  const combinedCells = (element: BilledeTekstBlokElement | KontaktformularTekstBlokElement) => {
    const textCell = (
      <div className={`${styles.cell} ${styles.paragraph}`}>
        {element.tekst && element.tekst.length > 0 && (
          <PortableText value={element.tekst} components={bodyComponents} />
        )}
        {element.kontaktKnapper && <KontaktKnapper kontakt={kontakt} />}
      </div>
    )
    if (element._type === 'billedeTekstBlok') {
      const billede = element.billede
      const fuld = billede?.visning === 'fuld'
      const ratio = fuld ? getImageAspectRatio(billede) : undefined
      const imageCell = (
        <div
          className={`${styles.cell} ${styles.imageArea}`}
          style={ratio ? {aspectRatio: ratio, alignSelf: 'start'} : undefined}
        >
          <div className={styles.imageBox}>
            {billede?.asset?._ref && (
              <Image
                src={(fuld ? urlFor(billede).width(1000) : urlFor(billede).width(700).height(700)).url()}
                alt={billede.alt || ''}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      )
      return element.billedePosition === 'right' ? [textCell, imageCell] : [imageCell, textCell]
    }
    const formCell = (
      <div className={`${styles.cell} ${styles.contactCell}`}>
        <ContactForm
          title={element.kontaktfelt?.heading || 'Få et uforpligtende tilbud'}
          recipientEmail={element.kontaktfelt?.recipientEmail || 'tjekforrod@gmail.com'}
        />
      </div>
    )
    return element.kontaktfeltPosition === 'right' ? [textCell, formCell] : [formCell, textCell]
  }

  // A banner image or a centered text block renders as a single cell that
  // spans the full width of the row.
  const fullRowCell = (element: SectionElement) => {
    if (element._type === 'billedeElement') {
      const fuld = element.visning === 'fuld'
      const ratio = fuld ? getImageAspectRatio(element) : undefined
      const image = fuld ? urlFor(element).width(1400) : urlFor(element).width(1400).height(600)
      return (
        <div
          className={`${styles.cell} ${styles.imageArea} ${styles.fullRow}`}
          style={ratio ? {aspectRatio: ratio} : undefined}
        >
          <div className={styles.imageBox}>
            {element.asset?._ref && (
              <Image src={image.url()} alt={element.alt || ''} fill sizes="100vw" />
            )}
          </div>
        </div>
      )
    }
    const tekst = element as TekstElement
    const noBaggrund = tekst.centreret && tekst.baggrund === false
    return (
      <div
        className={`${styles.cell} ${styles.paragraph} ${styles.centered} ${styles.fullRow} ${noBaggrund ? styles.noBaggrund : ''}`}
      >
        {tekst.body && tekst.body.length > 0 && (
          <PortableText value={tekst.body} components={bodyComponents} />
        )}
        {tekst.kontaktKnapper && <KontaktKnapper kontakt={kontakt} />}
      </div>
    )
  }

  const isFlatFullRow = (element: SectionElement) =>
    element._type === 'tekstElement' && element.centreret && element.baggrund === false

  // A banner image, a centered text block, and a combined block (image+text
  // or contact form+text) all always take a full row to themselves instead
  // of sharing a cell.
  const isFullRow = (element?: SectionElement) =>
    element?._type === 'billedeTekstBlok' ||
    element?._type === 'kontaktformularTekstBlok' ||
    (element?._type === 'billedeElement' && element.banner) ||
    (element?._type === 'tekstElement' && element.centreret)

  // Group elements into rows: two ordinary elements share a row, while a
  // full-row element (banner image, centered text, or combined block) always
  // closes out whatever pair was in progress and takes a row to itself.
  type Row =
    | {kind: 'pair'; a?: SectionElement; b?: SectionElement}
    | {kind: 'combined'; element: BilledeTekstBlokElement | KontaktformularTekstBlokElement}
    | {kind: 'full'; element: SectionElement}
    | {kind: 'anbefalinger'; element: AnbefalingerBlokElement}
    | {kind: 'galleri'; element: BilledeGalleriBlokElement}

  const rows: Row[] = []
  let buffer: SectionElement[] = []
  const flushBuffer = () => {
    if (buffer.length > 0) {
      rows.push({kind: 'pair', a: buffer[0], b: buffer[1]})
      buffer = []
    }
  }
  for (const el of elementer) {
    if (el._type === 'billedeTekstBlok' || el._type === 'kontaktformularTekstBlok') {
      flushBuffer()
      rows.push({kind: 'combined', element: el})
    } else if (el._type === 'anbefalingerBlok') {
      flushBuffer()
      rows.push({kind: 'anbefalinger', element: el})
    } else if (el._type === 'billedeGalleriBlok') {
      flushBuffer()
      rows.push({kind: 'galleri', element: el})
    } else if (isFullRow(el)) {
      flushBuffer()
      rows.push({kind: 'full', element: el})
    } else {
      buffer.push(el)
      if (buffer.length === 2) flushBuffer()
    }
  }
  flushBuffer()

  // Rows alternate sides continuously.
  const oppositeSide = startSide === 'left' ? 'right' : 'left'
  const sideForRow = (rowIndex: number) => (rowIndex % 2 === 0 ? startSide : oppositeSide)

  return (
    <div id={section.slug?.current?.trim()}>
      {rows.length > 0 && (
        <div className={styles.extraImages}>
          {rows.map((row, i) => {
            if (row.kind === 'combined') {
              const [left, right] = combinedCells(row.element)
              return (
                <section className={styles.bento} key={row.element._key}>
                  {left}
                  {right}
                </section>
              )
            }
            if (row.kind === 'anbefalinger') {
              return <AnbefalingerSection element={row.element} key={row.element._key} />
            }
            if (row.kind === 'galleri') {
              return <BilledeGalleriSection element={row.element} key={row.element._key} />
            }
            if (row.kind === 'full') {
              return (
                <section
                  className={`${styles.bento} ${isFlatFullRow(row.element) ? styles.bentoFlat : ''}`}
                  key={row.element._key}
                >
                  {fullRowCell(row.element)}
                </section>
              )
            }
            const side = sideForRow(i)
            const {a, b} = row
            const cellA = a ? elementCell(a) : emptyCell
            const cellB = b ? elementCell(b) : emptyCell
            return (
              <section className={styles.bento} key={a?._key ?? b?._key ?? i}>
                {side === 'right' ? (
                  <>
                    {cellB}
                    {cellA}
                  </>
                ) : (
                  <>
                    {cellA}
                    {cellB}
                  </>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default async function Home() {
  const frontpage = await client.fetch<Frontpage | null>(
    `*[_type == "frontpage"][0]{sections[]{_key, _type, title, slug, imagePosition, elementer[]{...}, position, recipientEmail}}`,
  )
  const kontakt = await client.fetch<Kontakt | null>(
    `*[_type == "kontakt"][0]{heading, navn, cvr, email, telefon, links}`,
  )

  const sections = frontpage?.sections ?? []

  return (
    <div className={styles.page}>
      {sections.map((section) => {
        if (section._type === 'kontaktSektion') {
          return <KontaktSection key={section._key} kontakt={kontakt} />
        }
        return section._type === 'kontaktformular' ? (
          <ContactFormSection key={section._key} section={section} />
        ) : (
          <SectionBlock key={section._key} section={section} kontakt={kontakt} />
        )
      })}
    </div>
  )
}
