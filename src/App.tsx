import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Create = lazy(() => import('./pages/Create'))
const About = lazy(() => import('./pages/About'))

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid-bg flex items-center justify-center">
          <div className="flex items-center gap-3 text-fg/60 text-lg">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  )
}
