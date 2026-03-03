import SpotifyEmbed from './SpotifyEmbed'
import type { Submission } from '../lib/supabase'

interface DedicationCardProps {
    submission: Submission
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DedicationCard({ submission }: DedicationCardProps) {
    const recipientName = submission.recipient_name || 'Someone'

    return (
        <div className="break-inside-avoid rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl group bg-card-bg hover:bg-card-bg-hover shadow-card">
            {/* Card Content */}
            <div className="px-6 pt-5 pb-3">
                {/* Header: Recipient pill + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-accent text-fg tracking-wide">
                        To: {recipientName}
                    </span>
                    <span className="text-sm text-fg-dark/60 font-semibold">
                        {formatDate(submission.created_at)}
                    </span>
                </div>

                {/* Message */}
                {submission.message && (
                    <p className="text-lg leading-relaxed text-fg-dark/90 font-medium">
                        {submission.message}
                    </p>
                )}
            </div>

            {/* Player Bar — prominent, larger */}
            <div className="px-4 pb-4">
                <SpotifyEmbed url={submission.spotify_url} compact />
            </div>
        </div>
    )
}
