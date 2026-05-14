import api from './axios'
export const startExam   = (examId)     => api.post(`/results/start/${examId}/`)
export const submitExam  = (sessionId, data) => api.post(`/results/submit/${sessionId}/`, data)
export const getScores   = (params)     => api.get('/results/scores/', { params })
