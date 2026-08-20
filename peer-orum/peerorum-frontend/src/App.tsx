import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SignupModalProvider } from './context/SignupModalContext'
import RequireAdmin from './components/auth/RequireAdmin'
import SignupModal from './components/auth/SignupModal'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import OAuth2RedirectHandler from './pages/auth/OAuth2RedirectHandler'
import MySpecsPage from './pages/mypage/MySpecsPage'
import SpecRegisterPage from './pages/mypage/SpecRegisterPage'
import SpecEditPage from './pages/mypage/SpecEditPage'
import VerificationStatusPage from './pages/mypage/VerificationStatusPage'
import ComparePage from './pages/compare/ComparePage'
import AnonymousProfileDetailPage from './pages/compare/AnonymousProfileDetailPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage'
import AdminSuspensionsPage from './pages/admin/AdminSuspensionsPage'
import AdminPlaceholderPage from './pages/admin/AdminPlaceholderPage'

const ADMIN_PLACEHOLDER_ROUTES = [
  { path: '/admin/spec-cards', title: '스펙 카드 관리' },
  { path: '/admin/reports', title: '신고 관리' },
  { path: '/admin/notices', title: '공지사항 관리' },
  { path: '/admin/stats', title: '서비스 통계' },
  { path: '/admin/analytics', title: '사용자 분석' },
  { path: '/admin/activity-log', title: '활동 로그' },
  { path: '/admin/settings', title: '설정 관리' },
  { path: '/admin/policies', title: '사원/정책 관리' },
  { path: '/admin/system', title: '시스템 관리' },
]

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SignupModalProvider>
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/oauth2/redirect"
              element={<OAuth2RedirectHandler />}
            />

            <Route path="/mypage/specs" element={<MySpecsPage />} />
            <Route
              path="/mypage/specs/register"
              element={<SpecRegisterPage />}
            />
            <Route
              path="/mypage/specs/edit"
              element={<SpecEditPage />}
            />
            <Route
              path="/mypage/verification"
              element={<VerificationStatusPage />}
            />

            <Route path="/compare" element={<ComparePage />} />
            <Route
              path="/compare/:studentId"
              element={<AnonymousProfileDetailPage />}
            />

            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboardPage />
                </RequireAdmin>
              }
            />

            <Route
              path="/admin/users"
              element={
                <RequireAdmin>
                  <AdminUsersPage />
                </RequireAdmin>
              }
            />

            <Route
              path="/admin/verifications"
              element={
                <RequireAdmin>
                  <AdminVerificationsPage />
                </RequireAdmin>
              }
            />

            <Route
              path="/admin/suspensions"
              element={
                <RequireAdmin>
                  <AdminSuspensionsPage />
                </RequireAdmin>
              }
            />

            {ADMIN_PLACEHOLDER_ROUTES.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RequireAdmin>
                    <AdminPlaceholderPage title={route.title} />
                  </RequireAdmin>
                }
              />
            ))}
          </Routes>

          <SignupModal />
        </SignupModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App