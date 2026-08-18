import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SignupModalProvider } from './context/SignupModalContext'
import SignupModal from './components/auth/SignupModal'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import MySpecsPage from './pages/mypage/MySpecsPage'
import SpecRegisterPage from './pages/mypage/SpecRegisterPage'
import SpecEditPage from './pages/mypage/SpecEditPage'
import OAuth2RedirectHandler from './pages/auth/OAuth2RedirectHandler'
import VerificationStatusPage from './pages/mypage/VerificationStatusPage'
import ComparePage from './pages/compare/ComparePage'
import AnonymousProfileDetailPage from './pages/compare/AnonymousProfileDetailPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SignupModalProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            <Route path="/mypage/specs" element={<MySpecsPage />} />
            <Route path="/mypage/specs/register" element={<SpecRegisterPage />} />
            <Route path="/mypage/specs/edit" element={<SpecEditPage />} />
            <Route path="/mypage/verification" element={<VerificationStatusPage />} />

            <Route path="/compare" element={<ComparePage />} />
            <Route path="/compare/:studentId" element={<AnonymousProfileDetailPage />} />
          </Routes>

          <SignupModal />
        </SignupModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
