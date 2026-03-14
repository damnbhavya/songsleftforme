import { useState, useRef, useEffect, useCallback } from 'react'
import { PaintBucket } from 'lucide-react'
import { applyCursors } from '../lib/cursors'

const THEMES = [
    // Original themes
    { name: 'Rose', bg: '#FF3F6A', bgLight: '#FF6B8A', dark: '#B71036', darkHover: '#9A0D2E', cardBg: '#FFDAE2', cardHover: '#FFB5C5', fg: '#FFDAE2' },
    { name: 'Ocean', bg: '#3B82F6', bgLight: '#60A5FA', dark: '#1E3A5F', darkHover: '#162D4A', cardBg: '#DBEAFE', cardHover: '#BFDBFE', fg: '#DBEAFE' },
    { name: 'Violet', bg: '#8B5CF6', bgLight: '#A78BFA', dark: '#4C1D95', darkHover: '#3B1578', cardBg: '#EDE9FE', cardHover: '#DDD6FE', fg: '#EDE9FE' },
    { name: 'Emerald', bg: '#10B981', bgLight: '#34D399', dark: '#065F46', darkHover: '#064E3B', cardBg: '#D1FAE5', cardHover: '#A7F3D0', fg: '#D1FAE5' },
    { name: 'Coral', bg: '#FF6B6B', bgLight: '#FF8E8E', dark: '#8B2252', darkHover: '#6E1A40', cardBg: '#FFE0E0', cardHover: '#FFC4C4', fg: '#FFE0E0' },
    // New themes
    { name: 'Slate', bg: '#546E7A', bgLight: '#78909C', dark: '#263238', darkHover: '#1C262B', cardBg: '#E0E7EA', cardHover: '#C4D1D8', fg: '#ECEFF1' },
    { name: 'Midnight', bg: '#5C6BC0', bgLight: '#7986CB', dark: '#1A237E', darkHover: '#131A60', cardBg: '#E0E3F5', cardHover: '#C5CAEB', fg: '#EDEEF8' },
    { name: 'Amber', bg: '#E6930A', bgLight: '#F0AD4E', dark: '#7A4D00', darkHover: '#5C3A00', cardBg: '#FDF0D5', cardHover: '#FBE2AC', fg: '#FFF8EC' },
    { name: 'Sakura', bg: '#F48FB1', bgLight: '#F8BBD0', dark: '#8C1054', darkHover: '#6A0D40', cardBg: '#FDE4EF', cardHover: '#FACDE2', fg: '#FFF0F6' },
    { name: 'Mocha', bg: '#8D6E63', bgLight: '#A1887F', dark: '#3E2723', darkHover: '#2E1B17', cardBg: '#EDDFDB', cardHover: '#D7C4BC', fg: '#F5EEEB' },
]

// Secret theme — newspaper / editorial aesthetic
const NEWSPRINT = {
    name: 'Newsprint',
    bg: '#F5F0E6',
    bgLight: '#EDE8DC',
    dark: '#1A1A1A',
    darkHover: '#333333',
    cardBg: '#FFFDF8',
    cardHover: '#F5F0E6',
    fg: '#1A1A1A',
}

function setVar(n: string, v: string) { document.documentElement.style.setProperty(n, v) }

function getVisited(): Set<string> {
    try {
        const raw = localStorage.getItem('themes_visited')
        return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
}

function saveVisited(set: Set<string>) {
    try { localStorage.setItem('themes_visited', JSON.stringify([...set])) } catch { }
}

export default function ColorPickerFAB() {
    const [open, setOpen] = useState(false)
    const [visited, setVisited] = useState<Set<string>>(() => getVisited())
    const [secretUnlocked, setSecretUnlocked] = useState(false)
    const [justUnlocked, setJustUnlocked] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Check if all themes have been visited
    useEffect(() => {
        const allVisited = THEMES.every(t => visited.has(t.name))
        setSecretUnlocked(allVisited)
    }, [visited])

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    // Safe reload: set flag before reload, check on next load to prevent loop
    const safeReload = useCallback(() => {
        sessionStorage.setItem('theme_reloading', '1')
        location.reload()
    }, [])

    const applyRegular = useCallback((t: typeof THEMES[0]) => {
        // Check if we're switching away from Newsprint
        const wasNewsprint = document.documentElement.classList.contains('theme-newsprint')
        // Remove secret theme mode
        document.documentElement.classList.remove('theme-newsprint', 'theme-aurora')
        setVar('--color-bg', t.bg); setVar('--color-bg-light', t.bgLight)
        setVar('--color-fg', t.fg); setVar('--color-fg-dark', t.dark)
        setVar('--color-accent', t.dark); setVar('--color-accent-hover', t.darkHover)
        setVar('--color-player-bg', t.dark); setVar('--color-card-bg', t.cardBg)
        setVar('--color-card-bg-hover', t.cardHover)
        applyCursors(t.dark)
        setOpen(false)
        try { localStorage.setItem('theme', t.name) } catch { }
        // Reload if switching away from Newsprint so Spotify embeds update
        if (wasNewsprint) { safeReload(); return }

        // Track visited themes
        setVisited(prev => {
            const next = new Set(prev)
            const wasAllVisited = THEMES.every(th => next.has(th.name))
            next.add(t.name)
            const nowAllVisited = THEMES.every(th => next.has(th.name))
            saveVisited(next)
            // Trigger "just unlocked" animation
            if (!wasAllVisited && nowAllVisited) {
                setJustUnlocked(true)
                setOpen(true)
                setTimeout(() => setJustUnlocked(false), 2000)
            }
            return next
        })
    }, [safeReload])

    const applyNewsprint = useCallback((userInitiated = false) => {
        const t = NEWSPRINT
        document.documentElement.classList.add('theme-newsprint')
        setVar('--color-bg', t.bg); setVar('--color-bg-light', t.bgLight)
        setVar('--color-fg', t.fg); setVar('--color-fg-dark', t.dark)
        setVar('--color-accent', '#2A2A2A'); setVar('--color-accent-hover', '#1A1A1A')
        setVar('--color-player-bg', '#2A2A2A'); setVar('--color-card-bg', t.cardBg)
        setVar('--color-card-bg-hover', t.cardHover)
        applyCursors('#1A1A1A')
        setOpen(false)
        try { localStorage.setItem('theme', 'Newsprint') } catch { }
        if (userInitiated) safeReload()
    }, [safeReload])

    // Restore saved theme on mount
    useEffect(() => {
        // Clear reload flag if present
        sessionStorage.removeItem('theme_reloading')

        try {
            const saved = localStorage.getItem('theme')
            if (saved === 'Newsprint') {
                applyNewsprint(false)
            } else if (saved) {
                const theme = THEMES.find(t => t.name === saved)
                if (theme) applyRegular(theme)
            }
        } catch { }
    }, [applyRegular, applyNewsprint])

    return (
        <div ref={ref} className="fixed bottom-5 right-5 z-[9999]">
            {/* Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
            >
                <PaintBucket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute bottom-16 right-0 grid grid-cols-5 gap-3 bg-player-bg/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-fg/10 min-w-[260px]">
                    {THEMES.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => applyRegular(t)}
                            className="w-9 h-9 rounded-full cursor-pointer hover:scale-125 transition-transform duration-150 ring-2 ring-card-bg/50"
                            style={{ backgroundColor: t.bg }}
                            title={t.name}
                        />
                    ))}

                    {/* Secret Newsprint theme — only shows after all themes visited */}
                    {secretUnlocked && (
                        <button
                            onClick={() => applyNewsprint(true)}
                            className={`w-9 h-9 rounded-full cursor-pointer hover:scale-125 transition-all duration-300 secret-theme-swatch ${justUnlocked ? 'secret-theme-reveal' : ''}`}
                            title="📰 Newsprint"
                        />
                    )}
                </div>
            )}
        </div>
    )
}
