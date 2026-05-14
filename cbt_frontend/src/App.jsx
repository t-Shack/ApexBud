import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Layouts
import AdminLayout   from './components/layout/AdminLayout'
import TeacherLayout from './components/layout/TeacherLayout'
import StudentLayout from './components/layout/StudentLayout'

// Pages
import Login from './pages/Login'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminStudents  from './pages/admin/Students'
import AdminTeachers  from './pages/admin/Teachers'
import AdminClasses   from './pages/admin/Classes'
import AdminSubjects  from './pages/admin/Subjects'
import AdminExams     from './pages/admin/Exams'
import AdminResults   from './pages/admin/Results'

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherQuestions from './pages/teacher/Questions'
import TeacherExams     from './pages/teacher/Exams'
import TeacherResults   from './pages/teacher/Results'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import ExamRoom         from './pages/student/ExamRoom'
import ExamComplete     from './pages/student/ExamComplete'

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin')   return <Navigate to="/admin" replace />
  if (user.role === 'teacher') return <Navigate to="/teacher" replace />
  if (user.role === 'student') return <Navigate to="/student" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/"      element={<RoleRedirect />} />

      {/* Admin */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"           element={<AdminDashboard />} />
          <Route path="/admin/students"  element={<AdminStudents />} />
          <Route path="/admin/teachers"  element={<AdminTeachers />} />
          <Route path="/admin/classes"   element={<AdminClasses />} />
          <Route path="/admin/subjects"  element={<AdminSubjects />} />
          <Route path="/admin/exams"     element={<AdminExams />} />
          <Route path="/admin/results"   element={<AdminResults />} />
        </Route>
      </Route>

      {/* Teacher */}
      <Route element={<ProtectedRoute role="teacher" />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher"           element={<TeacherDashboard />} />
          <Route path="/teacher/questions" element={<TeacherQuestions />} />
          <Route path="/teacher/exams"     element={<TeacherExams />} />
          <Route path="/teacher/results"   element={<TeacherResults />} />
        </Route>
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student"          element={<StudentDashboard />} />
          <Route path="/student/exam/:id" element={<ExamRoom />} />
          <Route path="/student/done"     element={<ExamComplete />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
