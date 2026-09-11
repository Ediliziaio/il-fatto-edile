import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { salvaParametriCampagna } from './lib/eicLead'

// salva UTM/gclid/fbclid all'atterraggio: l'iscrizione può avvenire su un'altra pagina
salvaParametriCampagna()

const rootEl = document.getElementById('root')!

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// se la pagina è prerenderizzata (SSG) idrata l'HTML esistente, altrimenti monta da zero
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
