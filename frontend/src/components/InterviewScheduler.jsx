// src/components/InterviewScheduler.jsx
import React, { useState } from 'react'
import { TextField, Typography, Button } from '@mui/material'
import { motion as Motion } from 'framer-motion'
import axios from 'axios'

export default function InterviewScheduler() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSchedule = async () => {
    const score = parseFloat(localStorage.getItem('lastScore') || '0')
    try {
      const res = await axios.post(
        'http://localhost:8000/send_interview_email/',
        null,
        {
          params: {
            email,
            candidate_name: name,
            match_score: score,
          },
        }
      )
      setStatus(res.data.message || 'Sent')
    } catch (err) {
      console.error(err)
      setStatus('Failed to send invitation')
    }
  }

  return (
    <>
      <Typography variant="h5">Interview Scheduler</Typography>

      <TextField
        label="Candidate Name"
        fullWidth
        sx={{ my: 1 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        sx={{ my: 1 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Motion.div whileTap={{ scale: 0.95 }}>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSchedule}>
          Send Invitation
        </Button>
      </Motion.div>

      {status && <Typography sx={{ mt: 2 }}>Status: {status}</Typography>}
    </>
  )
}
