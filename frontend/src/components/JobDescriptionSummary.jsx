// src/components/JobDescriptionSummary.jsx
import React, { useState } from 'react'
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Chip,
  InputAdornment,
  Divider,
} from '@mui/material'
import { motion as Motion } from 'framer-motion'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { api } from '../api/client'

export default function JobDescriptionSummary({ onComplete }) {
  const [jd, setJd] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setJd('')
    }
  }

  const handleSummarize = async () => {
    setLoading(true)
    setError('')
    setSummary('')

    const formData = new FormData()

    if (file) {
      formData.append('jd_file', file)
    } else {
      formData.append(
        'jd_file',
        new Blob([jd], { type: 'text/plain' }),
        'jd.txt'
      )
    }

    try {
      const res = await api.post('/summarize_jd/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const summaryText = res.data.summary
      setSummary(summaryText)
      localStorage.setItem('lastSummary', JSON.stringify({ text: summaryText }))
      if (onComplete) onComplete({ summary: summaryText, completed: true })
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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DescriptionIcon sx={{ color: '#ea580c', mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1c1917' }}>
            Job Description Analysis
          </Typography>
          <Typography variant="body2" sx={{ color: '#78716c' }}>
            Upload or paste your job description for AI-powered analysis
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
          Choose Input Method:
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: file ? '#059669' : '#e7e5e4',
              color: file ? '#059669' : '#78716c',
            }}
          >
            Upload PDF/Text File
            <input
              type="file"
              hidden
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
            />
          </Button>

          {file && (
            <Chip
              label={file.name}
              onDelete={() => setFile(null)}
              color="success"
              variant="outlined"
              sx={{ maxWidth: 200 }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="caption" sx={{ color: '#78716c' }}>
            OR
          </Typography>
        </Divider>

        <TextField
          multiline
          rows={8}
          fullWidth
          placeholder="Paste your job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          disabled={!!file}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Motion.div whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSummarize}
          disabled={(!jd.trim() && !file) || loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Analyze Job Description'
          )}
        </Button>
      </Motion.div>

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {summary && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: '#fafaf9',
              borderRadius: 2,
              border: '1px solid #e7e5e4',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#059669', mr: 1 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1c1917' }}
              >
                AI Analysis Summary
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: '#44403c',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {summary}
            </Typography>
          </Box>
        </Motion.div>
      )}
    </Box>
  )
}
