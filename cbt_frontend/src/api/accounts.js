import api from './axios'
export const getStudents  = (params) => api.get('/accounts/students/', { params })
export const createStudent = (data)  => api.post('/accounts/students/', data)
export const updateStudent = (id, d) => api.patch(`/accounts/students/${id}/`, d)
export const deleteStudent = (id)    => api.delete(`/accounts/students/${id}/`)
export const getTeachers  = (params) => api.get('/accounts/teachers/', { params })
export const createTeacher = (data)  => api.post('/accounts/teachers/', data)
export const updateTeacher = (id, d) => api.patch(`/accounts/teachers/${id}/`, d)
export const deleteTeacher = (id)    => api.delete(`/accounts/teachers/${id}/`)
