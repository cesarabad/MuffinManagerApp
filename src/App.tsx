import { Suspense } from 'react'
import './App.css'
import './configuration'
import AppRouter from './routes/app-router'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()
  return (
    <Suspense fallback={<>{t("app.loading")}</>}>
      <AppRouter />
    </Suspense>
  )
}

export default App
