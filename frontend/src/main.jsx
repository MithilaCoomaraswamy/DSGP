import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './LoginForm.css'
import './profile.css'
import App from './App.jsx'
import './Chatbot.css'
import './Recommender.css'
import './Account.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
