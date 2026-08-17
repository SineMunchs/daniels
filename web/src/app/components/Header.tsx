'use client'

import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

type NavLink = {hash: string; label: string}

export default function Header({
  siteName,
  links,
}: {
  siteName: string
  links: NavLink[]
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [activeHash, setActiveHash] = useState<string | null>(null)

  // Track which section is currently in view to highlight the matching link.
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.hash))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHash(entry.target.id)
        }
      },
      {rootMargin: '-96px 0px -60% 0px', threshold: 0},
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [links])

  useEffect(() => {
    const details = detailsRef.current
    if (!details) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') details.open = false
    }
    const onClick = (event: MouseEvent) => {
      if (details.open && !details.contains(event.target as Node)) {
        details.open = false
      }
    }
    const onToggle = () => {
      document.body.style.overflow = details.open ? 'hidden' : ''
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onClick)
    details.addEventListener('toggle', onToggle)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
      details.removeEventListener('toggle', onToggle)
      document.body.style.overflow = ''
    }
  }, [])

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.name}>
          {siteName}
        </Link>

        <nav className={styles.desktopNav} aria-label="Hovedmenu">
          {links.map((link) => (
            <Link
              key={link.hash}
              href={`/#${link.hash}`}
              className={styles.desktopLink}
              data-active={activeHash === link.hash || undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <details ref={detailsRef} className={styles.details}>
          <summary className={styles.burger} aria-label="Menu">
            <span />
            <span />
            <span />
          </summary>

          <div className={styles.backdrop} aria-hidden="true" />

          <nav className={styles.menu} aria-label="Hovedmenu">
            {links.map((link, i) => (
              <Link
                key={link.hash}
                href={`/#${link.hash}`}
                className={styles.link}
                data-active={activeHash === link.hash || undefined}
                onClick={closeMenu}
                style={{'--i': i} as React.CSSProperties}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
