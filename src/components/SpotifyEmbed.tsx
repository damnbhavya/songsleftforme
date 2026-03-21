import { useState, useRef, useEffect } from 'react'

interface SpotifyEmbedProps {
    url: string
    compact?: boolean
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

// global playback tracking — only one embed plays at a time
const activeControllers = new Set<{ pause: () => void }>()
let currentlyPlaying: { pause: () => void } | null = null

function registerController(controller: { pause: () => void }) {
    activeControllers.add(controller)
}

function unregisterController(controller: { pause: () => void }) {
    activeControllers.delete(controller)
    if (currentlyPlaying === controller) currentlyPlaying = null
}

function onPlaybackStarted(controller: { pause: () => void }) {
    if (currentlyPlaying && currentlyPlaying !== controller) {
        try { currentlyPlaying.pause() } catch { }
    }
    currentlyPlaying = controller
}

// spotify iframe api — loaded once, shared across all embeds
let iframeAPIReady = false
let iframeAPICallbacks: (() => void)[] = []

function ensureSpotifyAPI(callback: () => void) {
    if (iframeAPIReady) { callback(); return }
    iframeAPICallbacks.push(callback)

    // don't inject the script twice
    if (document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) return

    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async = true
    document.body.appendChild(script)

        ; (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
            iframeAPIReady = true
                ; (window as any).SpotifyIFrameAPI = IFrameAPI
            iframeAPICallbacks.forEach(cb => cb())
            iframeAPICallbacks = []
        }
}

export default function SpotifyEmbed({ url, compact = false }: SpotifyEmbedProps) {
    const trackId = extractSpotifyTrackId(url)
    const [isVisible, setIsVisible] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const embedRef = useRef<HTMLDivElement>(null)
    const controllerRef = useRef<any>(null)

    // only load the iframe when the card scrolls into view
    useEffect(() => {
        if (!containerRef.current) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
            { rootMargin: '200px' }
        )
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    // create the embed once visible
    useEffect(() => {
        if (!isVisible || !trackId || !embedRef.current) return

        // newsprint theme gets dark spotify, everything else stays default (light)
        const isNewsprint = document.documentElement.classList.contains('theme-newsprint')

        ensureSpotifyAPI(() => {
            const IFrameAPI = (window as any).SpotifyIFrameAPI
            if (!IFrameAPI || !embedRef.current) return

            const options: any = {
                uri: `spotify:track:${trackId}`,
                width: '100%',
                height: compact ? 80 : 152,
            }
            if (isNewsprint) {
                options.theme = 'dark'
            }

            const element = embedRef.current
            IFrameAPI.createController(element, options, (controller: any) => {
                controllerRef.current = controller
                registerController(controller)
                setIsLoaded(true)

                // pause other embeds when this one starts playing
                controller.addListener('playback_update', (e: any) => {
                    if (e.data.isPaused === false) {
                        onPlaybackStarted(controller)
                    }
                })
            })
        })

        return () => {
            if (controllerRef.current) {
                unregisterController(controllerRef.current)
                controllerRef.current = null
            }
        }
    }, [isVisible, trackId, compact])

    if (!trackId) {
        return (
            <div className="w-full rounded-xl bg-fg-dark/10 p-4 text-center text-fg-dark/50 text-sm">
                Invalid Spotify link
            </div>
        )
    }

    const height = compact ? 80 : 152

    return (
        <div ref={containerRef} style={{ minHeight: height, cursor: 'auto' }} className="relative rounded-xl overflow-hidden">
            {!isLoaded && (
                <div className="absolute inset-0 bg-fg-dark/10 animate-pulse rounded-xl" />
            )}
            {isVisible && (
                <div ref={embedRef} className="rounded-xl" />
            )}
        </div>
    )
}
