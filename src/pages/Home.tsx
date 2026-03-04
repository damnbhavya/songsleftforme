import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type Submission } from '../lib/supabase'
import DedicationCard from '../components/DedicationCard'
import HoverBoldText from '../components/HoverBoldText'
import ColorPickerFAB from '../components/ColorPickerFAB'
import { Search, Filter, AudioLines } from 'lucide-react'

export default function Home() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [searchFilter, setSearchFilter] = useState<'all' | 'name' | 'song'>('all')
    const [showFilterMenu, setShowFilterMenu] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const heroRef = useRef<HTMLElement>(null)

    useEffect(() => {
        async function fetchSubmissions() {
            setIsLoading(true)
            setError(null)
            try {
                const { data, error: fetchError } = await supabase
                    .from('submissions')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (fetchError) throw fetchError
                setSubmissions(data || [])
            } catch (err) {
                console.error('Failed to fetch submissions:', err)
                setError('Could not load dedications. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchSubmissions()
    }, [])

    // Parallax scroll effect for hero
    useEffect(() => {
        const hero = heroRef.current
        if (!hero) return

        let ticking = false
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY
                    hero.style.transform = `translateY(${scrollY * 0.3}px)`
                    hero.style.opacity = `${Math.max(1 - scrollY / 600, 0)}`
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const filteredSubmissions = useMemo(() => {
        if (!searchQuery.trim()) return submissions

        const query = searchQuery.trim().toLowerCase()
        return submissions.filter((s) => {
            const nameMatch = s.recipient_name?.toLowerCase().includes(query)
            const songMatch = s.song_title?.toLowerCase().includes(query)
            const messageMatch = s.message?.toLowerCase().includes(query)
            if (searchFilter === 'name') return nameMatch
            if (searchFilter === 'song') return songMatch
            return nameMatch || songMatch || messageMatch
        })
    }, [submissions, searchQuery, searchFilter])

    return (
        <div className="min-h-screen grid-bg">
            {/* About button — top right */}
            <Link
                to="/about"
                className="fixed top-5 right-5 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm animate-fade-in"
            >
                <AudioLines className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            {/* Hero Section */}
            <section ref={heroRef} className="relative z-30 text-center pt-20 pb-8 sm:pb-12 px-4 parallax-hero">
                {/* Title */}
                <h1 className="text-5xl sm:text-7xl md:text-9xl text-fg tracking-tight font-brand italic whitespace-nowrap animate-fade-up">
                    <HoverBoldText text="songs left for me" baseWeight={400} hoverWeight={800} radius={3} />
                </h1>

                {/* Subtitle */}
                <p className="mt-10 text-xl sm:text-2xl text-fg/90 max-w-lg mx-auto animate-fade-up delay-1">
                    <HoverBoldText text="for songs you never had the courage to send." baseWeight={400} hoverWeight={1000} radius={3} />
                </p>

                {/* Search + Filter + Create */}
                <div className="mt-12 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3 animate-fade-up delay-2">
                    <div className="w-full sm:flex-1 relative flex items-center gap-2">
                        {/* Search icon on left */}
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-fg-dark/30" strokeWidth={2.5} />
                        </div>
                        <input
                            type="text"
                            placeholder={searchFilter === 'name' ? 'search by name' : searchFilter === 'song' ? 'search by song' : 'search for a name or song'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-12 pr-4 rounded-full bg-card-bg text-fg-dark placeholder:text-fg-dark/40 outline-none ring-0 border-2 border-transparent focus:border-accent transition-all duration-200 text-base font-medium"
                        />
                        {/* Filter Button */}
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className={`flex items-center gap-1.5 h-11 px-3.5 rounded-full transition-colors cursor-pointer text-base font-semibold ${searchFilter !== 'all'
                                    ? 'bg-accent text-fg'
                                    : 'bg-card-bg text-fg-dark/80 hover:text-fg-dark/100'
                                    }`}
                            >
                                <Filter className="w-4 h-4" strokeWidth={2.5} />
                                filter
                            </button>
                            {showFilterMenu && (
                                <div className="absolute top-12 right-0 bg-player-bg rounded-2xl shadow-lg border border-fg/10 p-2 min-w-[150px] z-20 flex flex-col gap-1">
                                    {([['all', 'all'], ['name', 'by name'], ['song', 'by song']] as const).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => { setSearchFilter(key); setShowFilterMenu(false) }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer ${searchFilter === key ? 'text-fg bg-fg/15' : 'text-fg/60 hover:text-fg hover:bg-fg/8'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <Link
                        to="/create"
                        className="flex-shrink-0 w-full sm:w-auto text-center flex items-center justify-center h-11 px-8 bg-accent text-fg rounded-full text-base font-bold hover:bg-accent-hover transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        create
                    </Link>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-20 animate-fade-up delay-3">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <div className="flex items-center gap-3 text-fg/60 text-lg">
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>loading dedications…</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-fg/60 text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-8 py-3.5 bg-accent text-fg rounded-full text-lg font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-16">

                        <h2 className="text-2xl font-bold text-fg mb-3">
                            {searchQuery ? 'no matches found' : 'no dedications yet'}
                        </h2>
                        <p className="text-fg-muted text-lg mb-6">
                            {searchQuery
                                ? 'no results found. try dedicating a song instead!'
                                : 'be the first to dedicate a song to someone special'}
                        </p>
                        {!searchQuery && (
                            <Link
                                to="/create"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-fg rounded-full text-lg font-bold hover:bg-accent-hover transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                create the first one
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Dedication count */}
                        <p className="text-center text-base text-fg/80 mt-6 mb-6 font-semibold">
                            <HoverBoldText text={`${filteredSubmissions.length.toLocaleString()} song${filteredSubmissions.length !== 1 ? 's' : ''} shared${searchQuery ? ` matching "${searchQuery}"` : ''}`} baseWeight={400} hoverWeight={1000} radius={3} />

                        </p>

                        {/* Card Masonry */}
                        <MasonryGrid items={filteredSubmissions} />
                    </>
                )}
            </section>

            {/* Floating Color Picker */}
            <ColorPickerFAB />
        </div>
    )
}

// Masonry grid: CSS columns for even gaps, JS reordering for row-wise display
function MasonryGrid({ items }: { items: Submission[] }) {
    const [cols, setCols] = useState(3)

    useEffect(() => {
        function update() {
            const w = window.innerWidth
            setCols(w >= 1024 ? 3 : w >= 640 ? 2 : 1)
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    // Reorder items so CSS columns (which fill top-to-bottom) display them row-wise
    const reordered = useMemo(() => {
        if (cols <= 1) return items
        const rows = Math.ceil(items.length / cols)
        const result: Submission[] = []
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const idx = row * cols + col
                if (idx < items.length) result.push(items[idx])
            }
        }
        return result
    }, [items, cols])

    // Scroll-reveal for cards
    const observerRef = useRef<IntersectionObserver | null>(null)
    const cardRefs = useCallback((node: HTMLDivElement | null) => {
        if (!node) return
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible')
                            observerRef.current?.unobserve(entry.target)
                        }
                    })
                },
                { rootMargin: '50px', threshold: 0.1 }
            )
        }
        observerRef.current.observe(node)
    }, [])

    useEffect(() => {
        return () => observerRef.current?.disconnect()
    }, [])

    return (
        <div style={{ columns: cols, columnGap: '2.5rem' }}>
            {reordered.map((submission, i) => (
                <div
                    key={submission.id}
                    ref={cardRefs}
                    className="mb-8 break-inside-avoid card-reveal"
                    style={{ transitionDelay: `${(i % (cols * 2)) * 80}ms` }}
                >
                    <DedicationCard submission={submission} />
                </div>
            ))}
        </div>
    )
}
