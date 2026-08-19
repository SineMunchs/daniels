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
  const headerRef = useRef<HTMLElement>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [activeHash, setActiveHash] = useState<string | null>(null)

  // Keep the sticky header's real height available to CSS (scroll-padding-top)
  // and to the scroll-tracking logic below, since it varies by breakpoint/content.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const setHeaderHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
    }

    setHeaderHeight()
    const observer = new ResizeObserver(setHeaderHeight)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // Track which section is currently in view to highlight the matching link.
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.hash))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    let frame = 0

    const updateActive = () => {
      frame = 0
      const anchor = (headerRef.current?.offsetHeight ?? 0) + 16
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1
      if (atBottom) {
        setActiveHash(sections[sections.length - 1].id)
        return
      }
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= anchor) current = section
      }
      setActiveHash(current.id)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(updateActive)
    }

    updateActive()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
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

  const activeLink = links.find((link) => link.hash === activeHash) ?? links[0]

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.name}>
          {siteName}
        </Link>

        {activeLink && <p className={styles.current}>{activeLink.label}</p>}

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
                <span className={styles.linkIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.linkLabel}>{link.label}</span>
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  )
}
