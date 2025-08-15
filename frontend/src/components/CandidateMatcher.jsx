// src/components/CandidateMatcher.jsx
import React, { useState, useEffect } from 'react'
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { api } from '../api/client'
import { motion as Motion } from 'framer-motion'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import SkillChart from './SkillChart'
import SkillsBreakdownChart from './SkillsBreakdownChart'

export default function CandidateMatcher({ onComplete, onNext }) {
  const [cvFile, setCvFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    onDrop: (files) => {
      setCvFile(files[0])
      setScore(null)
      setError('')
    },
    maxFiles: 1,
  })

  useEffect(() => {
    if (cvFile) {
      const url = URL.createObjectURL(cvFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [cvFile])

  const handleMatch = async () => {
    const jdSummary = JSON.parse(localStorage.getItem('lastSummary') || '{}')
    if (!jdSummary.text) {
      setError('Please summarize a job description first')
      return
    }

    setLoading(true)
    setError('')
    setScore(null)

    const form = new FormData()
    form.append('cv_file', cvFile)

    try {
      const cvRes = await api.post('/parse_cv/', form)
      const matchRes = await api.post('/match_cv_jd/', {
        jd_summary: jdSummary,
        candidate_data: cvRes.data,
      })
      const s = matchRes.data.match_score
      const detailsData = matchRes.data.details || {}
      console.log('Match response:', matchRes.data)
      console.log('Details received:', detailsData)
      console.log('Skills breakdown:', detailsData.skills_breakdown)
      setScore(s)
      setDetails(detailsData)
      localStorage.setItem('lastScore', String(s))
      if (onComplete)
        onComplete({ score: s, details: detailsData, completed: true })
    } catch (err) {
      console.error('Error matching candidate:', err)
      setError(
        err.response?.data?.detail ||
          'Failed to match candidate. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonSearchIcon sx={{ color: '#ea580c', mr: 2, fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1c1917' }}>
            Candidate Screening
          </Typography>
          <Typography variant="body2" sx={{ color: '#78716c' }}>
            Upload candidate CV/Resume for AI-powered matching analysis
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              border: '1px solid #e7e5e4',
              boxShadow: 'none',
            }}
          >
            <CardContent>
              <Box
                {...getRootProps()}
                sx={{
                  border: `2px dashed ${
                    cvFile ? '#059669' : isDragActive ? '#ea580c' : '#d6d3d1'
                  }`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive
                    ? '#ffedd5'
                    : cvFile
                    ? '#f0fdf4'
                    : '#fafaf9',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#ea580c',
                    backgroundColor: '#ffedd5',
                  },
                }}
              >
                <input {...getInputProps()} />
                {cvFile ? (
                  <Box>
                    <CheckCircleIcon
                      sx={{ fontSize: 48, color: '#059669', mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {cvFile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      Click or drag to replace
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon
                      sx={{ fontSize: 48, color: '#a8a29e', mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Drop CV here or click to select
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#78716c' }}>
                      Supports PDF, DOC, DOCX files
                    </Typography>
                  </Box>
                )}
              </Box>

              {cvFile && (
                <Box sx={{ mt: 3 }}>
                  <Motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleMatch}
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <AssignmentIcon />
                        )
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        background:
                          'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                        },
                      }}
                    >
                      {loading ? 'Analyzing...' : 'Analyze Candidate'}
                    </Button>
                  </Motion.div>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {previewUrl && (
            <Card
              sx={{
                height: '100%',
                border: '1px solid #e7e5e4',
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Document Preview
                </Typography>
                <Box
                  sx={{
                    height: 400,
                    border: '1px solid #e7e5e4',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <object
                    data={previewUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        flexDirection: 'column',
                      }}
                    >
                      <ErrorIcon
                        sx={{ fontSize: 48, color: '#a8a29e', mb: 2 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: '#78716c', mb: 2 }}
                      >
                        Cannot preview this file
                      </Typography>
                      <Button
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                      >
                        Download File
                      </Button>
                    </Box>
                  </object>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {score !== null && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ mt: 3, border: '1px solid #e7e5e4', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Matching Analysis Results
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mr: 2 }}>
                  Overall Match Score:
                </Typography>
                <Chip
                  label={`${Math.round(score)}%`}
                  color={
                    score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'
                  }
                  sx={{ fontWeight: 600, fontSize: 16, px: 2 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f5f5f4',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        score >= 80
                          ? '#059669'
                          : score >= 60
                          ? '#ea580c'
                          : '#dc2626',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {details && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 1,
                        border: '1px solid #e7e5e4',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#78716c', fontSize: '0.75rem' }}
                      >
                        Skills Match
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: '#ea580c' }}
                      >
                        {details.skills_match || 0}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 1,
                        border: '1px solid #e7e5e4',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#78716c', fontSize: '0.75rem' }}
                      >
                        Experience
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: '#ea580c' }}
                      >
                        {details.experience_match || 0}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 1,
                        border: '1px solid #e7e5e4',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#78716c', fontSize: '0.75rem' }}
                      >
                        Education
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: '#ea580c' }}
                      >
                        {details.education_match || 0}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 1,
                        border: '1px solid #e7e5e4',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#78716c', fontSize: '0.75rem' }}
                      >
                        Keywords
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: '#ea580c' }}
                      >
                        {details.keywords_found || 0}/
                        {details.total_keywords || 0}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: '#fafaf9',
                  borderRadius: 2,
                  border: '2px solid #ea580c',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: '#1c1917',
                    textAlign: 'center',
                  }}
                >
                  📊 Detailed Visual Analysis
                </Typography>
                <SkillChart details={details} score={score} />
              </Box>

              {details &&
                details.skills_breakdown &&
                details.skills_breakdown.length > 0 && (
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      backgroundColor: '#fff7ed',
                      borderRadius: 2,
                      border: '2px solid #fb923c',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#1c1917',
                        textAlign: 'center',
                      }}
                    >
                      🎯 Individual Skill Breakdown (
                      {details.skills_breakdown.length} skills analyzed)
                    </Typography>
                    <SkillsBreakdownChart
                      skillsBreakdown={details.skills_breakdown}
                    />
                  </Box>
                )}

              {(!details ||
                !details.skills_breakdown ||
                details.skills_breakdown.length === 0) && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: '#fafaf9',
                    borderRadius: 1,
                    border: '1px solid #e7e5e4',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: '#78716c', textAlign: 'center' }}
                  >
                    ⚠️ No detailed skill breakdown available. This may indicate
                    an issue with the analysis.
                  </Typography>
                </Box>
              )}

              {details && details.analysis && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: '#ffedd5',
                    borderRadius: 1,
                    borderLeft: '4px solid #ea580c',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1, color: '#1c1917' }}
                  >
                    AI Analysis:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#44403c', lineHeight: 1.6 }}
                  >
                    {details.analysis}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="body2"
                sx={{ color: '#78716c', mt: 2, mb: 3, textAlign: 'center' }}
              >
                {score >= 80
                  ? 'Excellent match! This candidate strongly aligns with the job requirements.'
                  : score >= 60
                  ? 'Good match. This candidate meets most of the job requirements.'
                  : 'Moderate match. Consider reviewing specific requirements with this candidate.'}
              </Typography>

              {onNext && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onNext}
                    sx={{
                      px: 4,
                      py: 1.5,
                      background:
                        'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                      },
                    }}
                  >
                    Continue to Interview Scheduling
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Motion.div>
      )}
    </Box>
  )
}
