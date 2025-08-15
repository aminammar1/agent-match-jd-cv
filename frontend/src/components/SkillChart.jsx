import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Box, Typography, Grid, Card, CardContent } from '@mui/material'

const COLORS = ['#ea580c', '#fb923c', '#fed7aa', '#ffedd5']

export default function SkillChart({ details }) {
  console.log('SkillChart received details:', details)

  if (!details) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" sx={{ color: '#78716c' }}>
          No analysis data available
        </Typography>
      </Box>
    )
  }

  const chartData = [
    { name: 'Skills Match', value: details.skills_match || 0 },
    { name: 'Experience Match', value: details.experience_match || 0 },
    { name: 'Education Match', value: details.education_match || 0 },
  ]

  const pieData = [
    { name: 'Skills', value: details.skills_match || 0, color: '#ea580c' },
    {
      name: 'Experience',
      value: details.experience_match || 0,
      color: '#fb923c',
    },
    {
      name: 'Education',
      value: details.education_match || 0,
      color: '#fed7aa',
    },
  ]

  const keywordData = [
    { name: 'Found', value: details.keywords_found || 0 },
    {
      name: 'Missing',
      value: (details.total_keywords || 0) - (details.keywords_found || 0),
    },
  ]

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ border: '1px solid #e7e5e4', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Match Score Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Score']}
                  labelStyle={{ color: '#1c1917' }}
                />
                <Bar dataKey="value" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ border: '1px solid #e7e5e4', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Score Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ value }) => `${value.toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Score']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ border: '1px solid #e7e5e4', boxShadow: 'none' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Keywords Analysis
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={keywordData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [value, 'Keywords']}
                      labelStyle={{ color: '#1c1917' }}
                    />
                    <Bar dataKey="value" fill="#fb923c" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#78716c', mb: 1 }}>
                  Keywords Found: {details.keywords_found || 0} /{' '}
                  {details.total_keywords || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: '#78716c' }}>
                  Match Rate:{' '}
                  {details.total_keywords
                    ? (
                        (details.keywords_found / details.total_keywords) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
