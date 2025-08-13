// src/components/Dashboard.jsx
import React from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material'
import { motion as Motion } from 'framer-motion'
import JobDescriptionSummary from './JobDescriptionSummary'
import CandidateMatcher from './CandidateMatcher'
import InterviewScheduler from './InterviewScheduler'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02 },
}

export default function Dashboard() {
  const theme = useTheme()

  const sections = [
    { element: <JobDescriptionSummary />, key: 'jd' },
    { element: <CandidateMatcher />, key: 'matcher' },
    { element: <InterviewScheduler />, key: 'scheduler' },
  ]

  return (
    <Container sx={{ py: theme.spacing(4) }}>
      <Typography variant="h3" gutterBottom>
        AI-Powered Screening Dashboard
      </Typography>

      {sections.map(({ element, key }, idx) => (
        <Motion.div
          key={key}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ duration: 0.4, delay: idx * 0.2 }}
          style={{ margin: `${theme.spacing(2)} 0` }}
        >
          <Card>
            <CardContent>{element}</CardContent>
          </Card>
        </Motion.div>
      ))}
    </Container>
  )
}
