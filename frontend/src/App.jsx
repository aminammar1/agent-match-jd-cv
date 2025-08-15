import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import theme from './theme'

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showDashboard ? (
        <Dashboard />
      ) : (
        <LandingPage onGetStarted={() => setShowDashboard(true)} />
      )}
    </ThemeProvider>
  )
}
