import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LocaleProvider } from './i18n/LocaleContext.jsx'
import './index.css'

// Purpose: point d’entrée React — monte l’app dans #root avec le contexte i18n (fr par défaut).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </React.StrictMode>
)
