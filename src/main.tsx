import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import './index.css'
import App from './App'
import { applyCursors } from './lib/cursors'

// set up themed cursors with the default rose accent
applyCursors('#B71036')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
