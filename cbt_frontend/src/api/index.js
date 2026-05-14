import api from './axios'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (data)         => api.post('/auth/login/', data)

// ── Accounts ──────────────────────────────────────────────────────────────────
export const getStudents    = ()     => api.get('/accounts/students/')
export const createStudent  = (data) => api.post('/accounts/students/', data)
export const updateStudent  = (id, data) => api.patch(`/accounts/students/${id}/`, data)
export const deleteStudent  = (id)   => api.delete(`/accounts/students/${id}/`)

export const getTeachers    = ()     => api.get('/accounts/teachers/')
export const createTeacher  = (data) => api.post('/accounts/teachers/', data)
export const deleteTeacher  = (id)   => api.delete(`/accounts/teachers/${id}/`)

// ── Academics ─────────────────────────────────────────────────────────────────
export const getClasses     = ()     => api.get('/academics/classes/')
export const createClass    = (data) => api.post('/academics/classes/', data)
export const deleteClass    = (id)   => api.delete(`/academics/classes/${id}/`)

export const getSubjects    = ()     => api.get('/academics/subjects/')
export const createSubject  = (data) => api.post('/academics/subjects/', data)
export const deleteSubject  = (id)   => api.delete(`/academics/subjects/${id}/`)

// ── Questions ────────────────────────────────────────────────────────────────
export const getQuestions   = ()     => api.get('/exams/questions/')
export const createQuestion = (data) => api.post('/exams/questions/', data)
export const deleteQuestion = (id)   => api.delete(`/exams/questions/${id}/`)

// ── Exams ────────────────────────────────────────────────────────────────────
export const getExams       = ()     => api.get('/exams/exams/')
export const getExam        = (id)   => api.get(`/exams/exams/${id}/`)
export const createExam     = (data) => api.post('/exams/exams/', data)
export const updateExam     = (id, data) => api.patch(`/exams/exams/${id}/`, data)
export const deleteExam     = (id)   => api.delete(`/exams/exams/${id}/`)
export const getExamQuestions   = (id)   => api.get(`/exams/exams/${id}/questions/`)
export const addExamQuestion    = (id, data) => api.post(`/exams/exams/${id}/add-question/`, data)

// ── Results ──────────────────────────────────────────────────────────────────
export const startExam      = (examId)    => api.post(`/results/start/${examId}/`)
export const submitExam     = (sessionId, data) => api.post(`/results/submit/${sessionId}/`, data)
export const getScores      = (examId)    => api.get('/results/scores/', { params: examId ? { exam_id: examId } : {} })
