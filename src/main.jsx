import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router/router.js'
import { RouterProvider } from 'react-router'
import AuthProvider from './Context/AuthProvider.js'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      <ToastContainer position="top-center" />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
