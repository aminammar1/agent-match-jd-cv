import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
} from '@mui/material'
import { motion as Motion } from 'framer-motion'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SpeedIcon from '@mui/icons-material/Speed'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import SecurityIcon from '@mui/icons-material/Security'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

export default function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Matching',
      description:
        'Advanced algorithms analyze CVs against job requirements with precision and speed.',
      color: '#ea580c',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Instant Results',
      description:
        'Get comprehensive candidate evaluations in seconds, not hours.',
      color: '#0ea5e9',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Detailed Analytics',
      description:
        'Visual breakdowns of skills, experience, and education matching.',
      color: '#10b981',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description:
        'Enterprise-grade security with consistent, unbiased candidate assessment.',
      color: '#8b5cf6',
    },
  ]

  const stats = [
    { value: '99.8%', label: 'Accuracy Rate', icon: <TrendingUpIcon /> },
    { value: '2.5s', label: 'Average Analysis Time', icon: <SpeedIcon /> },
    {
      value: '500+',
      label: 'Companies Trust Us',
      icon: <WorkspacePremiumIcon />,
    },
    { value: '24/7', label: 'AI Availability', icon: <LightbulbIcon /> },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #fef3e2 0%, #ffffff 50%, #f0f9ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background:
            'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background:
            'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Chip
                label="✨ AI-Powered Recruitment"
                sx={{
                  mb: 3,
                  px: 2,
                  py: 0.5,
                  backgroundColor: 'rgba(234, 88, 12, 0.1)',
                  color: '#ea580c',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid rgba(234, 88, 12, 0.2)',
                }}
              />
            </Motion.div>

            <Avatar
              sx={{
                width: { xs: 70, md: 80 },
                height: { xs: 70, md: 80 },
                background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                margin: '0 auto 2rem',
                boxShadow: '0 8px 25px rgba(234, 88, 12, 0.25)',
              }}
            >
              <PersonSearchIcon
                sx={{ fontSize: { xs: 35, md: 40 }, color: 'white' }}
              />
            </Avatar>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                background:
                  'linear-gradient(135deg, #1c1917 0%, #44403c 50%, #ea580c 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: {
                  xs: '2.5rem',
                  sm: '3rem',
                  md: '4rem',
                  lg: '4.5rem',
                },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Smart Recruitment
              <br />
              <span style={{ fontSize: '0.85em', fontWeight: 700 }}>
                Made Simple
              </span>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#64748b',
                mb: 6,
                maxWidth: 650,
                margin: '0 auto 3rem',
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              Transform your hiring process with AI-driven candidate matching.
              <br />
            </Typography>

            <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStarted}
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 4,
                  background:
                    'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                  boxShadow: '0 12px 30px rgba(234, 88, 12, 0.35)',
                  textTransform: 'none',
                  minWidth: 200,
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                    boxShadow: '0 16px 40px rgba(234, 88, 12, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Get Started Free
              </Button>
            </Motion.div>
          </Motion.div>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: 6, mb: 6 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} md={3} key={index}>
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: { xs: 2, md: 3 },
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: { xs: 120, md: 140 },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ color: '#ea580c', mb: 1 }}>{stat.icon}</Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: '#1e293b',
                        mb: 0.5,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Card>
                </Motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                color: '#1e293b',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#64748b',
                mb: 6,
                maxWidth: 600,
                margin: '0 auto 4rem',
                fontSize: '1.1rem',
              }}
            >
              Experience the future of recruitment with cutting-edge AI
              technology designed for modern HR professionals.
            </Typography>
          </Motion.div>

          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4 }}
              sx={{
                mt: 2,
                maxWidth: {
                  xs: '100%',
                  sm: '100%',
                  md: '1000px',
                  lg: '1200px',
                },
                width: '100%',
              }}
              justifyContent="center"
            >
              {features.map((feature, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={3}
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    style={{
                      height: '100%',
                      width: '100%',
                      maxWidth: '280px',
                    }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                          '& .feature-icon': {
                            transform: 'scale(1.1) rotate(5deg)',
                          },
                          '&::before': {
                            opacity: 1,
                          },
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: { xs: 3, md: 4 },
                          textAlign: 'center',
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: { xs: 200, md: 220 },
                        }}
                      >
                        <Box>
                          <Box
                            className="feature-icon"
                            sx={{
                              color: feature.color,
                              mb: { xs: 2, md: 3 },
                              display: 'flex',
                              justifyContent: 'center',
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: { xs: 1.5, md: 2 },
                              color: '#1e293b',
                              fontSize: { xs: '1.1rem', md: '1.2rem' },
                            }}
                          >
                            {feature.title}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                            mt: 'auto',
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Box
              sx={{
                background:
                  'linear-gradient(135deg, rgba(234, 88, 12, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)',
                borderRadius: 6,
                p: { xs: 4, md: 8 },
                border: '1px solid rgba(234, 88, 12, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
                  zIndex: 0,
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#1e293b',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  Ready to revolutionize your hiring?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#475569',
                    mb: 5,
                    maxWidth: 550,
                    margin: '0 auto 3rem',
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Join thousands of modern HR teams who have streamlined their
                  recruitment process with intelligent candidate matching.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={onGetStarted}
                      sx={{
                        px: 6,
                        py: 2.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 4,
                        background:
                          'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                        boxShadow: '0 12px 30px rgba(234, 88, 12, 0.35)',
                        textTransform: 'none',
                        minWidth: 220,
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                          boxShadow: '0 16px 40px rgba(234, 88, 12, 0.45)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Start Matching Candidates
                    </Button>
                  </Motion.div>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    ✨ No credit card required
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Motion.div>
        </Box>
      </Container>
    </Box>
  )
}
