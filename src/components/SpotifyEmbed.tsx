import { useState, useEffect, useRef } from 'react'

// Global audio manager — only one track plays at a time
let currentAudio: HTMLAudioElement | null = null
let currentSetter: ((playing: boolean) => void) | null = null

function stopCurrentAudio() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null }
    if (currentSetter) { currentSetter(false); currentSetter = null }
}

interface SpotifyEmbedProps {
    url: string
    compact?: boolean
}

interface TrackData {
    title: string
    artist: string
    albumArt: string
    previewUrl: string | null
}

function extractSpotifyTrackId(url: string): string | null {
    const urlMatch = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/)
    if (urlMatch) return urlMatch[1]
    const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/)
    if (uriMatch) return uriMatch[1]
    return null
}

export function isValidSpotifyUrl(url: string): boolean {
    return extractSpotifyTrackId(url) !== null
}

const trackCache = new Map<string, TrackData>()

async function fetchOEmbedData(trackId: string) {
    try {
        const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${trackId}`)}`)
        if (!res.ok) return null
        const data = await res.json()
        return { title: data.title || 'Unknown Track', thumbnail: data.thumbnail_url || '' }
    } catch { return null }
}

async function fetchItunesData(trackTitle: string) {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        // Clean the title — Spotify oEmbed returns "Song by Artist"
        const cleanTitle = trackTitle.replace(/\s+by\s+.+$/i, '').trim() || trackTitle
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanTitle)}&media=music&entity=song&limit=5&country=US`, { signal: controller.signal })
        clearTimeout(timeoutId)
        if (!res.ok) return { previewUrl: null, albumArt: null, artist: null }
        const data = await res.json()
        if (data.results?.length > 0) {
            // Find first result with a preview URL
            const withPreview = data.results.find((t: { previewUrl?: string }) => t.previewUrl)
            const t = withPreview || data.results[0]
            return { previewUrl: t.previewUrl || null, albumArt: t.artworkUrl100?.replace('100x100', '600x600') || null, artist: t.artistName || null }
        }
        return { previewUrl: null, albumArt: null, artist: null }
    } catch { return { previewUrl: null, albumArt: null, artist: null } }
}

async function fetchTrackData(trackId: string): Promise<TrackData | null> {
    if (trackCache.has(trackId)) return trackCache.get(trackId)!
    const oEmbed = await fetchOEmbedData(trackId)
    if (!oEmbed) return null
    const itunes = await fetchItunesData(oEmbed.title)
    const result: TrackData = {
        title: oEmbed.title, artist: itunes.artist || '',
        albumArt: itunes.albumArt || oEmbed.thumbnail, previewUrl: itunes.previewUrl,
    }
    trackCache.set(trackId, result)
    return result
}

export default function SpotifyEmbed({ url }: SpotifyEmbedProps) {
    const [hasError, setHasError] = useState(false)
    const [trackData, setTrackData] = useState<TrackData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const trackId = extractSpotifyTrackId(url)

    useEffect(() => {
        if (!trackId) return
        setIsLoading(true)
        fetchTrackData(trackId).then((data) => { setTrackData(data); setIsLoading(false); if (!data) setHasError(true) })
    }, [trackId])

    useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } }, [])

    const handlePlayPause = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        if (!trackData?.previewUrl) { window.open(`https://open.spotify.com/track/${trackId}`, '_blank', 'noopener,noreferrer'); return }
        if (isPlaying && audioRef.current) {
            audioRef.current.pause(); audioRef.current = null
            currentAudio = null; currentSetter = null
            setIsPlaying(false)
        } else {
            stopCurrentAudio()
            audioRef.current = new Audio(trackData.previewUrl); audioRef.current.volume = 0.5
            audioRef.current.addEventListener('ended', () => { setIsPlaying(false); audioRef.current = null; currentAudio = null; currentSetter = null })
            audioRef.current.play().catch(() => setIsPlaying(false))
            setIsPlaying(true)
            currentAudio = audioRef.current
            currentSetter = setIsPlaying
        }
    }

    if (!trackId || hasError) {
        return (
            <div className="flex items-center justify-center rounded-2xl text-sm p-3.5 bg-player-bg/80 text-fg/60" style={{ minHeight: '78px' }}>
                <span>Preview unavailable</span>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-player-bg">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl animate-pulse bg-fg/10" />
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-3/4 rounded animate-pulse bg-fg/10" />
                    <div className="h-3 w-1/2 rounded animate-pulse bg-fg/8" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-player-bg hover:bg-accent-hover transition-all duration-200 cursor-pointer" onClick={handlePlayPause}>
            {/* Album Art */}
            <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-fg/10 relative">
                    {trackData?.albumArt && (
                        <img
                            src={trackData.albumArt} alt=""
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)} loading="lazy"
                        />
                    )}
                    {!imageLoaded && <div className="absolute inset-0 animate-pulse rounded-xl bg-fg/10" />}
                </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-fg truncate leading-tight">
                    {trackData?.title || 'Unknown Track'}
                </p>
                {trackData?.artist && (
                    <p className="text-sm text-fg/50 truncate mt-1">
                        {trackData.artist}
                    </p>
                )}
            </div>

            {/* Play/Pause Button */}
            <button
                className="flex-shrink-0 w-9 h-9 rounded-full bg-fg/15 hover:bg-fg/25 flex items-center justify-center transition-all duration-200"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <svg className="w-4 h-4 text-fg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                    <svg className="w-4 h-4 text-fg ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
            </button>
        </div>
    )
}
