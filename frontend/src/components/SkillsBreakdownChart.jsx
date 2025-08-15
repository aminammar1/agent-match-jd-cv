import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Box, Typography, Card, CardContent, Chip } from '@mui/material'

export default function SkillsBreakdownChart({ skillsBreakdown = [] }) {
  console.log('SkillsBreakdownChart received:', skillsBreakdown)

  if (!skillsBreakdown || skillsBreakdown.length === 0) {
    return (
      <Card sx={{ border: '1px solid #e7e5e4', boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Skill-by-Skill Analysis
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#78716c' }}>
              No detailed skill data available. The system may not have detected
              specific skills in the job description or CV.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const chartData = skillsBreakdown.map((skill) => ({
    skill: skill.skill,
    match: skill.match_percentage,
    found: skill.found,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e7e5e4',
            borderRadius: 1,
            p: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#78716c' }}>
            Match: {data.match}%
          </Typography>
          <Chip
            label={data.found ? 'Found in CV' : 'Missing from CV'}
            size="small"
            color={data.found ? 'success' : 'error'}
            sx={{ mt: 1 }}
          />
        </Box>
      )
    }
    return null
  }

  return (
    <Card sx={{ border: '1px solid #e7e5e4', boxShadow: 'none' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Skill-by-Skill Analysis
        </Typography>

        {chartData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={Math.max(300, chartData.length * 40)}
          >
            <BarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="skill"
                type="category"
                width={90}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="match"
                radius={[0, 4, 4, 0]}
                fill={(entry) => (entry.found ? '#ea580c' : '#fed7aa')}
              >
                {chartData.map((entry, index) => (
                  <Bar
                    key={`cell-${index}`}
                    fill={entry.found ? '#ea580c' : '#fed7aa'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#78716c' }}>
              No skill data available
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {skillsBreakdown.slice(0, 10).map((skill, index) => (
            <Chip
              key={index}
              label={`${skill.skill}: ${skill.match_percentage}%`}
              size="small"
              color={skill.found ? 'success' : 'default'}
              variant={skill.found ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
