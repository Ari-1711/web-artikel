import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// 1. Import Bootstrap paling atas agar menjadi pondasi dasar layout
import 'bootstrap/dist/css/bootstrap.min.css'

// 2. Import Fonts agar jenis huruf dari Google Fonts terunduh
import './fonts.css'

// 3. Import Index paling bawah agar variabel warna Figma Anda menimpa warna Bootstrap
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)