import type { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'

interface AppProps {
  readonly __noProps?: never
}

const routes = {
  login: '/login',
  register: '/register',
} as const

const App: FC<AppProps> = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes.login} replace />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.register} element={<RegisterPage />} />
      <Route path="*" element={<Navigate to={routes.login} replace />} />
    </Routes>
  )
}

export default App
