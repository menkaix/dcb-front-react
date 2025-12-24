import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import BatimentList from '@/features/batiments/components/BatimentList'
import BatimentDetail from '@/features/batiments/components/BatimentDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/batiments" replace />,
      },
      {
        path: 'batiments',
        children: [
          {
            index: true,
            element: <BatimentList />,
          },
          {
            path: ':batimentId',
            element: <BatimentDetail />,
          },
        ],
      },
    ],
  },
])
