// src/components/CandidateMatcher.jsx
import React, { useState, useEffect } from 'react'
import { Button, Typography, Slider } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { motion as Motion } from 'framer-motion'
import SkillChart from './SkillChart'

export default function CandidateMatcher() {
  const [cvFile, setCvFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [score, setScore] = useState(null)
  const [details, setDetails] = useState({})
  const [threshold, setThreshold] = useState(0.8)

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    onDrop: (files) => setCvFile(files[0]),
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
    const form = new FormData()
    form.append('cv_file', cvFile)

    try {
      const cvRes = await axios.post('http://localhost:8000/parse_cv/', form)
      const matchRes = await axios.post('http://localhost:8000/match_cv_jd/', {
        jd_summary: jdSummary,
        candidate_data: cvRes.data,
      })
      // Backend returns a 0-100 integer score
      const s = matchRes.data.match_score
      setScore(s)
      // Persist for InterviewScheduler
      localStorage.setItem('lastScore', String(s))
      setDetails(matchRes.data.details || {})
    } catch (err) {
      console.error('Error matching candidate:', err)
    }
  }

  const chartData = Object.entries(details).map(([skill, val]) => ({
    skill,
    score: val,
  }))

  return (
    <>
      <Typography variant="h5">Candidate Matcher</Typography>

      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #aaa',
          padding: 20,
          marginTop: 8,
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        {cvFile ? cvFile.name : 'Drag & drop CV (PDF) here, or click to select'}
      </div>

      {previewUrl && (
        <object
          data={previewUrl}
          type="application/pdf"
          width="100%"
          height="400px"
          style={{ marginTop: 16, border: '1px solid #ccc' }}
        >
          <p>
            Cannot preview PDF.{' '}
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              Download
            </a>
          </p>
        </object>
      )}

      <Typography sx={{ mt: 2 }}>
        Threshold: {Math.round(threshold * 100)}%
      </Typography>
      <Slider
        value={threshold}
        step={0.05}
        marks
        min={0}
        max={1}
        onChange={(e, v) => setThreshold(v)}
      />

      <Motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!cvFile}
          onClick={handleMatch}
        >
          Match
        </Button>
      </Motion.div>

      {score !== null && (
        <Typography sx={{ mt: 2 }}>
          Overall Match Score: {Math.round(score)}%
        </Typography>
      )}

      {chartData.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Skill-by-Skill Breakdown
          </Typography>
          <SkillChart data={chartData} />
        </>
      )}
    </>
  )
}
