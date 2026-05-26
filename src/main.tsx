import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './i18n'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster position="top-right" />
    </AuthProvider>
  </BrowserRouter>,
)
