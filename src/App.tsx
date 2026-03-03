import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Create from './pages/Create'
import About from './pages/About'

export default function App() {
  return (
    <Routes>
      {/* Standalone pages — no navbar/footer */}
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />

      {/* Other pages — with navbar/footer */}
      <Route element={<Layout />}>
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}
