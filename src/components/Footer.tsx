import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="border-t border-fg/5 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <Link to="/" className="text-lg font-semibold text-fg hover:text-accent transition-colors font-brand">
                            sentby.me
                        </Link>
                        <p className="text-sm text-fg-muted mt-1">Songs sent into the void</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/about" className="text-sm text-fg-muted hover:text-fg transition-colors">
                            About
                        </Link>
                        <Link to="/create" className="text-sm text-fg-muted hover:text-fg transition-colors">
                            Create
                        </Link>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-fg/5 text-center">
                    <p className="text-xs text-fg-muted">
                        &copy; {new Date().getFullYear()} sentby.me — All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}
