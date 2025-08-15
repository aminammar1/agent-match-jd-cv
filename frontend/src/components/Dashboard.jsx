// src/components/Dashboard.jsx
import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import { motion as Motion } from 'framer-motion'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import DescriptionIcon from '@mui/icons-material/Description'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AssessmentIcon from '@mui/icons-material/Assessment'
import JobDescriptionSummary from './JobDescriptionSummary'
import CandidateMatcher from './CandidateMatcher'
import InterviewScheduler from './InterviewScheduler'

const steps = [
  { label: 'Job Analysis', icon: DescriptionIcon },
  { label: 'Candidate Screening', icon: PersonSearchIcon },
  { label: 'Interview Scheduling', icon: ScheduleIcon },
]

export default function Dashboard() {
  const [activeStep, setActiveStep] = useState(0)
  const [processResults, setProcessResults] = useState({
    jobAnalysis: null,
    candidateAnalysis: null,
    interviewStatus: null,
  })

  const updateResult = (step, data) => {
    setProcessResults((prev) => ({
      ...prev,
      [step]: data,
    }))
  }

  const handleStepClick = (step) => {
    setActiveStep(step)
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <JobDescriptionSummary
            onComplete={(data) => {
              setActiveStep(1)
              updateResult('jobAnalysis', data)
            }}
          />
        )
      case 1:
        return (
          <CandidateMatcher
            onComplete={(data) => {
              updateResult('candidateAnalysis', data)
            }}
            onNext={() => setActiveStep(2)}
          />
        )
      case 2:
        return (
          <InterviewScheduler
            onComplete={(data) => {
              updateResult('interviewStatus', data)
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e7e5e4',
        }}
      >
        <Toolbar>
          <PersonSearchIcon sx={{ color: '#ea580c', mr: 2 }} />
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: '#1c1917',
              fontWeight: 600,
            }}
          >
            AI Recruitment Platform
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Intelligent Recruitment System
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#78716c', mb: 3 }}>
            Automated candidate analysis and matching platform
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: 'white',
              border: '1px solid #e7e5e4',
              borderRadius: 2,
            }}
          >
            <Stepper activeStep={activeStep} sx={{ mb: 3 }} connector={null}>
              {steps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <Step
                    key={step.label}
                    onClick={() => handleStepClick(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:
                              index <= activeStep ? '#ea580c' : '#e7e5e4',
                            color: index <= activeStep ? 'white' : '#78716c',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <IconComponent sx={{ fontSize: 20 }} />
                        </Box>
                      )}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: index === activeStep ? 600 : 400,
                          color: index === activeStep ? '#1c1917' : '#78716c',
                        }}
                      >
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>

            {/* Process Results Summary */}
            {(processResults.jobAnalysis ||
              processResults.candidateAnalysis ||
              processResults.interviewStatus) && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <AssessmentIcon sx={{ mr: 1, color: '#ea580c' }} />
                  Process Results
                </Typography>
                <Grid container spacing={2}>
                  {processResults.jobAnalysis && (
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          border: '1px solid #e7e5e4',
                          boxShadow: 'none',
                          backgroundColor: '#fafaf9',
                        }}
                      >
                        <CardContent sx={{ py: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: '#059669', mr: 1 }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              Job Analysis Complete
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Job description processed and analyzed
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {processResults.candidateAnalysis && (
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          border: '1px solid #e7e5e4',
                          boxShadow: 'none',
                          backgroundColor: '#fafaf9',
                        }}
                      >
                        <CardContent sx={{ py: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: '#059669', mr: 1 }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              Candidate Analyzed
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: '#78716c' }}
                            >
                              Match Score:
                            </Typography>
                            <Chip
                              label={`${
                                processResults.candidateAnalysis.score || 0
                              }%`}
                              size="small"
                              color={
                                (processResults.candidateAnalysis.score || 0) >=
                                80
                                  ? 'success'
                                  : (processResults.candidateAnalysis.score ||
                                      0) >= 60
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {processResults.interviewStatus && (
                    <Grid item xs={12} md={4}>
                      <Card
                        sx={{
                          border: '1px solid #e7e5e4',
                          boxShadow: 'none',
                          backgroundColor: '#fafaf9',
                        }}
                      >
                        <CardContent sx={{ py: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 16, color: '#059669', mr: 1 }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              Interview Status
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#78716c' }}>
                            {processResults.interviewStatus.message ||
                              'Interview scheduled'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Paper>
        </Box>

        <Motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: 'white',
              border: '1px solid #e7e5e4',
              borderRadius: 2,
              minHeight: 500,
            }}
          >
            {getStepContent(activeStep)}
          </Paper>
        </Motion.div>
      </Container>
    </Box>
  )
}
