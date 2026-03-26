import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Purpose: point d’entrée React — monte le composant racine dans #root.
// Key: StrictMode aide à détecter effets de bord en dev (double rendu).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
