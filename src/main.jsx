import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initPalette } from './lib/palette'
import { loadContent } from './lib/content'

// one dark theme only (the light mode was removed); clear any old preference
document.documentElement.classList.remove('light')
try { localStorage.removeItem('theme') } catch { /* ignore */ }

// apply a saved theme colour before first paint
initPalette()

// apply content edited in the admin panel (falls back to the built-in content), then render
loadContent().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
