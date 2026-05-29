import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({ sessionUser }) {
  if (!sessionUser) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
