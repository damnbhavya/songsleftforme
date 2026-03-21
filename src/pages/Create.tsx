import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { supabase } from '../lib/supabase'
import { isValidSpotifyUrl } from '../components/SpotifyEmbed'
import SpotifySongSearch from '../components/SpotifySongSearch'
import SpotifyEmbed from '../components/SpotifyEmbed'
import ColorPickerFAB from '../components/ColorPickerFAB'
import HoverBoldText from '../components/HoverBoldText'
import { ArrowLeft, AudioLines } from 'lucide-react'

const MAX_MESSAGE_LENGTH = 80
const MAX_NAME_LENGTH = 25

export default function Create() {
    const navigate = useNavigate()
    const [recipientName, setRecipientName] = useState('')
    const [message, setMessage] = useState('')
    const [spotifyUrl, setSpotifyUrl] = useState('')
    const [songTitle, setSongTitle] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const charCount = message.length
    const isCharLimitExceeded = charCount > MAX_MESSAGE_LENGTH
    const isFormValid =
        !isCharLimitExceeded &&
        spotifyUrl.trim() !== '' &&
        isValidSpotifyUrl(spotifyUrl)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid || isSubmitting) return

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            // sanitize everything before it hits the database
            const sanitizedMessage = message.trim()
                ? DOMPurify.sanitize(message.trim())
                : null
            const sanitizedName = recipientName.trim()
                ? DOMPurify.sanitize(recipientName.trim())
                : 'someone'

            const { error } = await supabase.from('submissions').insert({
                recipient_name: sanitizedName,
                message: sanitizedMessage,
                spotify_url: spotifyUrl.trim(),
                song_title: songTitle || null,
            })

            if (error) {
                console.error('Supabase error:', error)
                throw new Error(error.message || 'Database error')
            }

            setSubmitSuccess(true)
            setTimeout(() => {
                navigate('/')
            }, 1500)
        } catch (err: unknown) {
            console.error('Submit error:', err)
            setSubmitError('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitSuccess) {
        return (
            <div className="min-h-screen grid-bg flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-4xl font-brand italic font-bold text-fg mb-3">your song is now out there.</h2>
                    <p className="text-sm text-fg/40 mt-3">returning home...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen grid-bg">
            <Link
                to="/"
                className="fixed top-5 left-5 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
            >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            <Link
                to="/about"
                className="fixed top-5 right-5 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
            >
                <AudioLines className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            <div className="text-center pt-20 pb-6 px-4 animate-fade-up">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-brand italic text-fg whitespace-nowrap">
                    <HoverBoldText text="dedicate a song" baseWeight={400} hoverWeight={800} radius={3} />
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-6 pb-20">
                <div className="rounded-3xl bg-card-bg shadow-card p-6 sm:p-8 transition-all duration-300 animate-fade-up delay-1">
                    {/* recipient name — auto-resizing input inside an accent pill */}
                    <div className="mb-5">
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent">
                            <span className="text-base font-bold text-fg">to:</span>
                            <div className="relative">
                                {/* invisible span that sizes the input to fit the text */}
                                <span className="invisible text-base font-bold whitespace-pre" aria-hidden="true">
                                    {recipientName || 'someone'}
                                </span>
                                <input
                                    type="text"
                                    placeholder="someone"
                                    maxLength={MAX_NAME_LENGTH}
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    className="absolute inset-0 bg-transparent text-base font-bold text-fg placeholder:text-fg/50 outline-none w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        {spotifyUrl && isValidSpotifyUrl(spotifyUrl) ? (
                            <div>
                                <SpotifyEmbed url={spotifyUrl} compact />
                                <button
                                    type="button"
                                    onClick={() => setSpotifyUrl('')}
                                    className="mt-2 text-xs font-medium text-fg-dark/50 hover:text-fg-dark/80 transition-colors cursor-pointer"
                                >
                                    remove
                                </button>
                            </div>
                        ) : (
                            <SpotifySongSearch
                                onTrackSelect={(url, title) => { setSpotifyUrl(url); setSongTitle(title || '') }}
                                currentUrl={spotifyUrl}
                            />
                        )}
                    </div>

                    <div className="mb-5">
                        <textarea
                            placeholder="what you wish you could say..."
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={`w-full px-4 py-3 bg-transparent text-lg leading-relaxed text-fg-dark/90 font-medium placeholder:text-fg-dark/30 outline-none resize-none rounded-2xl border-2 transition-colors duration-200 ${isCharLimitExceeded
                                ? 'border-red-400'
                                : 'border-fg-dark/15 focus:border-accent'
                                }`}
                        />
                        <div className="flex justify-end mt-1">
                            <span
                                className={`text-xs font-medium ${isCharLimitExceeded ? 'text-red-500' : charCount >= MAX_MESSAGE_LENGTH - 10 ? 'text-amber-600' : 'text-fg-dark/60'
                                    }`}
                            >
                                {charCount}/{MAX_MESSAGE_LENGTH}
                            </span>
                        </div>
                    </div>
                </div>

                {submitError && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 font-medium">
                        {submitError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full mt-6 h-13 bg-accent text-fg rounded-full font-bold text-lg transition-all duration-200 hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer animate-fade-up delay-2"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending...
                        </span>
                    ) : (
                        'share'
                    )}
                </button>
            </form>

            <ColorPickerFAB />
        </div>
    )
}
