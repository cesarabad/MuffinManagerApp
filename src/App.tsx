import { Suspense } from 'react'
import './App.css'
import './configuration'
import AppRouter from './routes/app-router'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'


function App() {
  const { t } = useTranslation()
  return (
    <Suspense fallback={<>{t("app.loading")}</>}>
      <AppRouter />
      <ToastContainer/>
    </Suspense>
  )
}

export default App
