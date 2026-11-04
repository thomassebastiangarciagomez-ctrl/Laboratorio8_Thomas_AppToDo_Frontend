import { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './features/auth/context/AuthContext'
import { AuthPage } from './features/auth/pages/AuthPage'
import { UserBar } from './features/auth/components/UserBar'
import { ViewTabs } from './features/admin/components/ViewTabs'
import { AdminSummaryPage } from './features/admin/pages/AdminSummaryPage'
import { TaskPage } from './features/tasks/pages/TaskPage'

function AuthenticatedApp() {
  const { user } = useAuth()
  const [view, setView] = useState("tasks")
  // Ocultar la pestaña es solo comodidad de interfaz: la autorización real la hace el backend.
  const isAdmin = user.role === "ADMIN"

  return (
    <>
      <UserBar />
      {isAdmin && <ViewTabs view={view} onChange={setView} />}
      {isAdmin && view === "summary" ? <AdminSummaryPage /> : <TaskPage />}
    </>
  )
}

function AppContent() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <AuthPage />
  }

  // key={user.id}: si cambia el usuario, todo se monta de cero (vista y tareas) y nunca se ven datos del anterior.
  return <AuthenticatedApp key={user.id} />
}

export function App(){
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
