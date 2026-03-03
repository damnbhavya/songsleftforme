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

export default function SpotifyEmbed({ url, compact = false }: SpotifyEmbedProps) {
    const trackId = extractSpotifyTrackId(url)

    if (!trackId) {
        return (
            <div className="w-full rounded-2xl bg-fg-dark/10 p-4 text-center text-fg-dark/50 text-sm">
                Invalid Spotify link
            </div>
        )
    }

    return (
        <iframe
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=1`}
            width="100%"
            height={compact ? 80 : 152}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-2xl"
            title="Spotify player"
        />
    )
}
