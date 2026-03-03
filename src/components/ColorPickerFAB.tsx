import { useState, useRef, useEffect, useCallback } from 'react'
import { PaintBucket } from 'lucide-react'

const THEMES = [
    { name: 'Rose', bg: '#FF3F6A', bgLight: '#FF6B8A', dark: '#B71036', darkHover: '#9A0D2E', cardBg: '#FFDAE2', cardHover: '#FFB5C5', fg: '#FFDAE2' },
    { name: 'Ocean', bg: '#3B82F6', bgLight: '#60A5FA', dark: '#1E3A5F', darkHover: '#162D4A', cardBg: '#DBEAFE', cardHover: '#BFDBFE', fg: '#DBEAFE' },
    { name: 'Violet', bg: '#8B5CF6', bgLight: '#A78BFA', dark: '#4C1D95', darkHover: '#3B1578', cardBg: '#EDE9FE', cardHover: '#DDD6FE', fg: '#EDE9FE' },
    { name: 'Emerald', bg: '#10B981', bgLight: '#34D399', dark: '#065F46', darkHover: '#064E3B', cardBg: '#D1FAE5', cardHover: '#A7F3D0', fg: '#D1FAE5' },
    { name: 'Coral', bg: '#FF6B6B', bgLight: '#FF8E8E', dark: '#8B2252', darkHover: '#6E1A40', cardBg: '#FFE0E0', cardHover: '#FFC4C4', fg: '#FFE0E0' },
]

function setVar(n: string, v: string) { document.documentElement.style.setProperty(n, v) }

export default function ColorPickerFAB() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const apply = useCallback((t: typeof THEMES[0]) => {
        setVar('--color-bg', t.bg); setVar('--color-bg-light', t.bgLight)
        setVar('--color-fg', t.fg); setVar('--color-fg-dark', t.dark)
        setVar('--color-accent', t.dark); setVar('--color-accent-hover', t.darkHover)
        setVar('--color-player-bg', t.dark); setVar('--color-card-bg', t.cardBg)
        setVar('--color-card-bg-hover', t.cardHover)
        setOpen(false)
        try { localStorage.setItem('theme', t.name) } catch { }
    }, [])

    // Restore saved theme on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('theme')
            if (saved) {
                const theme = THEMES.find(t => t.name === saved)
                if (theme) apply(theme)
            }
        } catch { }
    }, [apply])

    return (
        <div ref={ref} className="fixed top-5 right-5 z-50">
            {/* Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
            >
                <PaintBucket className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-16 right-0 flex gap-2 bg-player-bg/90 backdrop-blur-md px-3 py-2.5 rounded-full shadow-lg border border-fg/10">
                    {THEMES.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => apply(t)}
                            className="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition-transform duration-150 ring-1 ring-card-bg"
                            style={{ backgroundColor: t.bg }}
                            title={t.name}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
