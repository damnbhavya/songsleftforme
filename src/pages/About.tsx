import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ColorPickerFAB from '../components/ColorPickerFAB'
import HoverBoldText from '../components/HoverBoldText'
import { ArrowLeft, Instagram } from 'lucide-react'

export default function About() {
    const [showSocials, setShowSocials] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShowSocials(true), 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen grid-bg">
            {/* Back button — top left */}
            <Link
                to="/"
                className="fixed top-5 left-5 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
            >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Link>

            <ColorPickerFAB />

            {/* Social buttons — above theme FAB, right side */}
            <div className="fixed bottom-24 sm:bottom-28 right-5 z-50 hidden sm:flex flex-col gap-3">
                <a
                    href="https://www.instagram.com/damnbhavya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-500 cursor-pointer shadow-lg backdrop-blur-sm"
                    style={{
                        transform: showSocials ? 'translateX(0)' : 'translateX(calc(100% + 2rem))',
                        opacity: showSocials ? 1 : 0,
                        transitionDelay: '150ms',
                    }}
                >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </a>
                <a
                    href="https://open.spotify.com/user/31ohvk2dzwypbbidqvzijixfftfq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-500 cursor-pointer shadow-lg backdrop-blur-sm"
                    style={{
                        transform: showSocials ? 'translateX(0)' : 'translateX(calc(100% + 2rem))',
                        opacity: showSocials ? 1 : 0,
                        transitionDelay: '0ms',
                    }}
                >
                    {/* Spotify icon */}
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                </a>
            </div>

            {/* Header */}
            <div className="text-center pt-20 pb-6 px-4 animate-fade-up">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-brand italic text-fg whitespace-nowrap">
                    <HoverBoldText text="about" baseWeight={400} hoverWeight={800} radius={3} />
                </h1>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-20">
                {/* Description */}
                <div className="p-6 bg-card-bg rounded-2xl shadow-card animate-fade-up delay-1">
                    <div className="space-y-5 text-lg leading-relaxed text-fg-dark/80">
                        <p>
                            Sometimes there are things you wish you could say but <strong className="text-fg-dark">never do</strong>.
                        </p>

                        <p>
                            <strong className="text-fg-dark">songsleftfor.me</strong> is a place for those moments. Share a song you couldn't send to someone, a friend, a stranger, someone you miss, or someone you never had the courage to speak to. Add a short message, or let the <strong className="text-fg-dark">music speak for itself</strong>.
                        </p>

                        <p>
                            Every dedication is <strong className="text-fg-dark">anonymous</strong>. No accounts, no names saved, just a song and a feeling left behind.
                        </p>
                        <p>
                            Created by <a href="https://bhavya.page" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">Bhavya</a>
                        </p>
                    </div>
                </div>

                {/* How it works */}
                <h2 className="text-3xl sm:text-4xl font-brand italic text-fg mt-12 mb-4 text-center animate-fade-up delay-2">
                    <HoverBoldText text="how it works" baseWeight={400} hoverWeight={800} radius={3} />
                </h2>
                <div className="p-6 bg-card-bg rounded-2xl shadow-card animate-fade-up delay-3">
                    <div className="space-y-3">
                        {[
                            { step: '1', text: 'Choose a song from Spotify — the one that says it all' },
                            { step: '2', text: 'Write a short message (or don\'t — sometimes the song is enough)' },
                            { step: '3', text: 'Send it into the void, anonymously' },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-accent text-fg text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                                    {item.step}
                                </span>
                                <p className="text-fg-dark/80">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center animate-fade-up delay-4">
                    <h2 className="text-3xl sm:text-4xl font-brand italic text-fg mb-4 text-center">
                        <HoverBoldText text="have a song to share?" baseWeight={400} hoverWeight={800} radius={3} />
                    </h2>
                    <Link
                        to="/create"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-fg rounded-full font-semibold hover:bg-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Create
                    </Link>
                </div>

                {/* Social icons — mobile only, inline */}
                <div className="mt-8 flex justify-center gap-4 sm:hidden animate-fade-up delay-5">
                    <a
                        href="https://www.instagram.com/damnbhavya/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a
                        href="https://open.spotify.com/user/31ohvk2dzwypbbidqvzijixfftfq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-accent/80 text-fg flex items-center justify-center hover:bg-accent transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}
