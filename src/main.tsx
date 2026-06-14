import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import { AppStateProvider } from './hooks/useAppState'
import './index.css'
import 'leaflet/dist/leaflet.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppStateProvider>
        <App />
        <Toaster
          richColors
          closeButton
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#0f2942',
              color: '#effaff',
              border: '1px solid rgba(131, 221, 255, 0.18)',
            },
          }}
        />
      </AppStateProvider>
    </BrowserRouter>
  </StrictMode>,
)
