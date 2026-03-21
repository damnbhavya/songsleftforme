// spotify web api — uses client credentials flow (no user login needed)

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || ''
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || ''

// token cache so we're not hitting /api/token on every search
let accessToken: string | null = null
let tokenExpiry = 0

export interface SpotifyTrack {
    id: string
    name: string
    artists: string
    albumName: string
    albumImage: string
    url: string
    previewUrl: string | null
}

async function getAccessToken(): Promise<string> {
    // reuse token if it's still good (with a 60s buffer)
    if (accessToken && Date.now() < tokenExpiry - 60000) {
        return accessToken
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
        throw new Error('Failed to authenticate with Spotify')
    }

    const data = await response.json()
    accessToken = data.access_token
    tokenExpiry = Date.now() + data.expires_in * 1000

    return accessToken!
}

export async function searchTracks(query: string, limit = 5): Promise<SpotifyTrack[]> {
    if (!query.trim() || !CLIENT_ID || !CLIENT_SECRET) return []

    try {
        const token = await getAccessToken()

        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        )

        if (!response.ok) {
            // 401 means the token expired — clear it and try once more
            if (response.status === 401) {
                accessToken = null
                tokenExpiry = 0
                const retryToken = await getAccessToken()
                const retryResponse = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
                    {
                        headers: { Authorization: `Bearer ${retryToken}` },
                    }
                )
                if (!retryResponse.ok) return []
                const retryData = await retryResponse.json()
                return mapTracks(retryData)
            }
            return []
        }

        const data = await response.json()
        return mapTracks(data)
    } catch (err) {
        console.error('Spotify search error:', err)
        return []
    }
}

function mapTracks(data: any): SpotifyTrack[] {
    if (!data?.tracks?.items) return []

    return data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => a.name).join(', '),
        albumName: track.album?.name || '',
        albumImage: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || '',
        url: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`,
        previewUrl: track.preview_url,
    }))
}

export function isSpotifySearchConfigured(): boolean {
    return CLIENT_ID !== '' && CLIENT_SECRET !== ''
}

export async function getTrackById(trackId: string): Promise<SpotifyTrack | null> {
    if (!CLIENT_ID || !CLIENT_SECRET) return null

    try {
        const token = await getAccessToken()
        const response = await fetch(
            `https://api.spotify.com/v1/tracks/${trackId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!response.ok) {
            if (response.status === 401) {
                accessToken = null
                tokenExpiry = 0
                const retryToken = await getAccessToken()
                const retryResponse = await fetch(
                    `https://api.spotify.com/v1/tracks/${trackId}`,
                    { headers: { Authorization: `Bearer ${retryToken}` } }
                )
                if (!retryResponse.ok) return null
                const track = await retryResponse.json()
                return mapSingleTrack(track)
            }
            return null
        }

        const track = await response.json()
        return mapSingleTrack(track)
    } catch (err) {
        console.error('Spotify getTrack error:', err)
        return null
    }
}

function mapSingleTrack(track: any): SpotifyTrack {
    return {
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => a.name).join(', '),
        albumName: track.album?.name || '',
        albumImage: track.album?.images?.[0]?.url || track.album?.images?.[1]?.url || '',
        url: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`,
        previewUrl: track.preview_url,
    }
}
