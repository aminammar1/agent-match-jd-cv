// src/components/InterviewScheduler.jsx
import React, { useState } from 'react'
import {
  TextField,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material'
import { motion as Motion } from 'framer-motion'
import ScheduleIcon from '@mui/icons-material/Schedule'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import SendIcon from '@mui/icons-material/Send'
import { api } from '../api/client'

export default function InterviewScheduler({ onComplete }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const lastScore = parseFloat(localStorage.getItem('lastScore') || '0')

  const handleSchedule = async () => {
    const score = parseFloat(localStorage.getItem('lastScore') || '0')
    if (!name.trim() || !email.trim()) {
      setStatus('Please fill in both name and email')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      const res = await api.post(
        `/send_interview_email/?email=${encodeURIComponent(
          email
        )}&candidate_name=${encodeURIComponent(name)}&match_score=${score}`
      )
      setStatus(res.data.message || 'Sent')
      setEmailSent(true)
      if (onComplete)
        onComplete({ message: res.data.message || 'Sent', completed: true })
    } catch (err) {
      console.error(err)
      setStatus(err.response?.data?.detail || 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ScheduleIcon sx={{ color: '#ea580c', mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1c1917' }}>
            Interview Scheduling
          </Typography>
          <Typography variant="body2" sx={{ color: '#78716c' }}>
            Send interview invitations to qualified candidates
          </Typography>
        </Box>
      </Box>

      {lastScore > 0 && (
        <Card sx={{ mb: 3, border: '1px solid #e7e5e4', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Candidate Assessment Summary
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Match Score:</Typography>
              <Chip
                label={`${Math.round(lastScore)}%`}
                color={
                  lastScore >= 80
                    ? 'success'
                    : lastScore >= 60
                    ? 'warning'
                    : 'error'
                }
                size="small"
              />
              <Typography variant="body2" sx={{ color: '#78716c' }}>
                {lastScore >= 80
                  ? 'Highly Recommended'
                  : lastScore >= 60
                  ? 'Recommended'
                  : 'Consider Carefully'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Candidate Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: <PersonIcon sx={{ color: '#a8a29e', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <EmailIcon sx={{ color: '#a8a29e', mr: 1 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
      </Grid>

      <Motion.div whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSchedule}
          disabled={loading || !name.trim() || !email.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            mt: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: emailSent
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
            '&:hover': {
              background: emailSent
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
            },
          }}
        >
          {loading
            ? 'Sending...'
            : emailSent
            ? 'Email Sent!'
            : 'Send Interview Invitation'}
        </Button>
      </Motion.div>

      {status && (
        <Alert
          severity={
            status.includes('sent') || status.includes('Sent')
              ? 'success'
              : 'error'
          }
          sx={{ mt: 3, borderRadius: 2 }}
        >
          {status}
        </Alert>
      )}

      {lastScore > 0 && lastScore < 60 && (
        <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
          Note: This candidate has a match score below 60%. Consider reviewing
          their qualifications carefully before scheduling an interview.
        </Alert>
      )}
    </Box>
  )
}
