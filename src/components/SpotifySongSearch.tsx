import { useState, useEffect, useRef } from 'react'
import { searchTracks, isSpotifySearchConfigured, type SpotifyTrack } from '../lib/spotify'
import { isValidSpotifyUrl } from './SpotifyEmbed'
import { Search } from 'lucide-react'

interface SpotifySongSearchProps {
    onTrackSelect: (url: string) => void
    currentUrl: string
    className?: string
}

export default function SpotifySongSearch({ onTrackSelect, currentUrl, className = '' }: SpotifySongSearchProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SpotifyTrack[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search — handles both text search AND link pasting
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setShowDropdown(false)
            return
        }

        // If it's a Spotify link, validate and select directly
        if (isValidSpotifyUrl(query.trim())) {
            onTrackSelect(query.trim())
            setResults([])
            setShowDropdown(false)
            return
        }

        if (!isSpotifySearchConfigured()) return

        setIsSearching(true)
        clearTimeout(debounceTimerRef.current)

        debounceTimerRef.current = setTimeout(async () => {
            const tracks = await searchTracks(query, 6)
            setResults(tracks)
            setShowDropdown(tracks.length > 0)
            setIsSearching(false)
        }, 350)

        return () => clearTimeout(debounceTimerRef.current)
    }, [query, onTrackSelect])

    const handleSelectTrack = (track: SpotifyTrack) => {
        onTrackSelect(track.url)
        setQuery(track.name + ' — ' + track.artists)
        setShowDropdown(false)
    }

    return (
        <div ref={containerRef} className={className}>
            {/* Search input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    {isSearching ? (
                        <svg className="w-4 h-4 text-fg/70 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <Search className="w-4 h-4 text-fg/70" strokeWidth={2.5} />
                    )}
                </div>
                <input
                    type="text"
                    placeholder="Search for a song or paste a Spotify link..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    className="w-full h-11 pl-11 pr-4 rounded-2xl bg-accent text-fg placeholder:text-fg/50 outline-none border-2 border-transparent focus:border-fg/20 transition-all duration-200 text-base font-medium"
                    autoComplete="off"
                />
            </div>

            {/* Results dropdown */}
            {showDropdown && (
                <div className="mt-2 rounded-2xl bg-accent overflow-hidden max-h-[240px] overflow-y-auto animate-[slideDown_0.2s_ease-out]">
                    {results.map((track) => (
                        <button
                            key={track.id}
                            type="button"
                            onClick={() => handleSelectTrack(track)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-fg/10 transition-colors text-left cursor-pointer"
                        >
                            {/* Album art */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-fg/10">
                                {track.albumImage ? (
                                    <img src={track.albumImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-fg/40">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-fg truncate">{track.name}</p>
                                <p className="text-xs text-fg/50 truncate">{track.artists}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Selected indicator */}
            {currentUrl && !showDropdown && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-400 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Song selected
                </div>
            )}
        </div>
    )
}
