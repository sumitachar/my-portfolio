import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initPalette } from './lib/palette'

// one dark theme only (the light mode was removed); clear any old preference
document.documentElement.classList.remove('light')
try { localStorage.removeItem('theme') } catch { /* ignore */ }

// apply a saved theme colour before first paint
initPalette()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
