import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './style.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<pre style="padding:20px;color:red;">Error: #root element not found in DOM</pre>'
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>,
    )
  } catch (err) {
    console.error('Failed to render app:', err)
    rootEl.innerHTML = `<pre style="padding:20px;color:red;background:#fee;font-family:monospace;">Render Error:\n${err}</pre>`
  }
}
