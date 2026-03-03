import { Link } from 'react-router-dom'

export default function About() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-fg tracking-tight font-brand">sentby.me</h1>
                <p className="mt-3 text-lg text-fg-muted">Songs sent into the void</p>
            </div>

            {/* Description */}
            <div className="space-y-6 text-fg-muted leading-relaxed">
                <p className="text-lg">
                    Sometimes there are things you wish you could say — words that sit heavy in your chest,
                    feelings you never quite find the right moment for. <strong className="text-fg">sentby.me</strong> is for those unsaid things.
                </p>

                <p>
                    Dedicate a song to someone special, a friend, a stranger, someone you've lost, or someone
                    you've never had the courage to speak to. Write a short message — just a few words — and
                    let the music carry everything else.
                </p>

                <p>
                    Every dedication is <strong className="text-fg">anonymous</strong>. No names attached, no accounts needed, no traces left behind.
                    Just a song, a message, and a feeling set free.
                </p>
            </div>

            {/* How it works */}
            <div className="mt-12 p-6 bg-white/60 rounded-2xl border border-fg/5">
                <h2 className="text-lg font-semibold text-fg mb-4">How it works</h2>
                <div className="space-y-3">
                    {[
                        { step: '1', text: 'Choose a song from Spotify — the one that says it all' },
                        { step: '2', text: 'Write a short message (just 30 words — keep it real)' },
                        { step: '3', text: 'Pick a color that feels right' },
                        { step: '4', text: 'Send it into the void, anonymously' },
                    ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                                {item.step}
                            </span>
                            <p className="text-fg-muted">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Privacy */}
            <div className="mt-8 p-6 bg-white/60 rounded-2xl border border-fg/5">
                <h2 className="text-lg font-semibold text-fg mb-2">Your privacy matters</h2>
                <p className="text-fg-muted leading-relaxed">
                    No accounts. No tracking. No data selling. Your dedications are anonymous by design.
                    We don't store personal information — just the songs and the feelings behind them.
                </p>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
                <p className="text-fg-muted mb-4">Got something to say?</p>
                <Link
                    to="/create"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent-hover transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create a Dedication
                </Link>
            </div>
        </div>
    )
}
