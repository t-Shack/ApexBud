import api from './axios'
export const getClasses    = ()      => api.get('/academics/classes/')
export const createClass   = (data)  => api.post('/academics/classes/', data)
export const updateClass   = (id, d) => api.patch(`/academics/classes/${id}/`, d)
export const deleteClass   = (id)    => api.delete(`/academics/classes/${id}/`)
export const getSubjects   = ()      => api.get('/academics/subjects/')
export const createSubject = (data)  => api.post('/academics/subjects/', data)
export const updateSubject = (id, d) => api.patch(`/academics/subjects/${id}/`, d)
export const deleteSubject = (id)    => api.delete(`/academics/subjects/${id}/`)
