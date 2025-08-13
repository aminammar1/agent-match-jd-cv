// src/components/JobDescriptionSummary.jsx
import React, { useState } from 'react'
import {
  Button,
  TextareaAutosize,
  Typography,
  CircularProgress,
} from '@mui/material'
import { motion as Motion } from 'framer-motion'
import axios from 'axios'

export default function JobDescriptionSummary() {
  const [jd, setJd] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    setSummary('')

    const formData = new FormData()
    formData.append('jd_file', new Blob([jd], { type: 'text/plain' }), 'jd.txt')

    try {
      const res = await axios.post(
        'http://localhost:8000/summarize_jd/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const summaryText = res.data.summary
      setSummary(summaryText)
      // Store under the key expected by the backend matcher: { text: ... }
      localStorage.setItem('lastSummary', JSON.stringify({ text: summaryText }))
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.detail || 'Summarization failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Job Description Summarizer
      </Typography>

      <TextareaAutosize
        minRows={6}
        placeholder="Paste your job description here…"
        style={{ width: '100%', marginTop: 8 }}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      <Motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSummarize}
          disabled={!jd.trim() || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Summarize'}
        </Button>
      </Motion.div>

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {summary && (
        <pre
          style={{
            background: '#f5f5f5',
            color: '#000000',
            padding: 16,
            marginTop: 16,
            whiteSpace: 'pre-wrap',
            borderRadius: 4,
          }}
        >
          {summary}
        </pre>
      )}
    </>
  )
}
