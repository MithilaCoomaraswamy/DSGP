import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/LoginForm.css'
import './styles/profile.css'
import App from './App.jsx'
import './styles/Chatbot.css'
import './styles/Recommender.css'
import './styles/Account.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
