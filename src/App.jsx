import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import { useBackendApp } from './hooks/useBackendApp'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import NotesPage from './pages/NotesPage'

function App() {
  const app = useBackendApp()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={app.sessionUser ? '/app/dashboard' : '/auth'} replace />} />
        <Route
          path="/auth"
          element={
            app.sessionUser ? (
              <Navigate to="/app/dashboard" replace />
            ) : (
              <AuthPage
                onLogin={app.login}
                onRegister={app.registerUser}
                loading={app.loading}
                message={app.message}
              />
            )
          }
        />
        <Route element={<ProtectedRoute sessionUser={app.sessionUser} />}>
          <Route
            path="/app"
            element={
              <AppShell
                currentUser={app.currentUser}
                sessionUser={app.sessionUser}
                onLogout={app.logout}
                message={app.message}
              />
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <DashboardPage
                  notes={app.notes}
                  currentUser={app.currentUser}
                  sessionUser={app.sessionUser}
                />
              }
            />
            <Route
              path="notes/:filter"
              element={
                <NotesPage
                  sessionUser={app.sessionUser}
                  notes={app.notes}
                  loadNotes={app.loadNotes}
                  createNote={app.createNote}
                  updateNote={app.updateNote}
                  deleteNote={app.deleteNote}
                  toggleArchive={app.toggleArchive}
                  addCategoryToNote={app.addCategoryToNote}
                  removeCategoryFromNote={app.removeCategoryFromNote}
                  loading={app.loading}
                />
              }
            />
            <Route path="notes" element={<Navigate to="all" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={app.sessionUser ? '/app/dashboard' : '/auth'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
