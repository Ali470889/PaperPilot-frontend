import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

// Routes
import ADMIN_ROUTES from './routes/ADMIN_ROUTES'

// Components
import Loading from './components/shared/Loading'

// Pages
import Login from './pages/general/login/Login'
import NotFound from './pages/general/notFound/NotFound'
import Dashboard from './pages/general/dashboard/Dashboard'
import Unauthorized from './pages/general/unauthorized/Unauthorized'

// Auth & Layout
import AuthProvider from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './layout/AppLayout'
import BoardPage from './pages/board/BoardPage'
import ProvincePage from './pages/province/ProvincePage'
import ClassPage from './pages/class/ClassPage'
import SubjectPage from './pages/Subject/SubjectPage'
import PublisherPage from './pages/publisher/PublisherPage'

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
          <Route path="/" element={<AppLayout />} >
            <Route
              path={ADMIN_ROUTES.DASHBOARD}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.DASHBOARD}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ADMIN_ROUTES.PROVINCE}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.PROVINCE}>
                  <ProvincePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ADMIN_ROUTES.BOARD}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.BOARD}>
                  <BoardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ADMIN_ROUTES.CLASS}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.CLASS}>
                  <ClassPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ADMIN_ROUTES.SUBJECT}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.SUBJECT}>
                  <SubjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ADMIN_ROUTES.PUBLISHER}
              element={
                <ProtectedRoute pageUrl={ADMIN_ROUTES.PUBLISHER}>
                  <PublisherPage />
                </ProtectedRoute>
              }
            />
            <Route path={ADMIN_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default App
