import { Clock, Mail, MessageCircle, Phone } from 'lucide-react'
import Logo from '../ui/Logo'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

const SERVICE_LINKS = ['스펙 비교', '커뮤니티', '서비스 소개', '이용 방법']
const SUPPORT_LINKS = ['공지사항', '자주 묻는 질문', '문의하기', '이용 가이드']
const LEGAL_LINKS = ['개인정보처리방침', '이용약관', '스펙 인증 운영정책']

export default function Footer() {
  return (
    <footer className="bg-ink-900 px-6 pt-16 text-gray-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 pb-14 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo variant="white" className="h-6" />
            <p className="mt-4 text-[13px] leading-relaxed">
              대학생 스펙 비교 및 성장 플랫폼을 함께 비교하고 함께 성장합니다.
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white">서비스</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white">고객지원</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white">연락처</h4>
            <ul className="mt-4 flex flex-col gap-3 text-[13px]">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                support@peerup.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                02-1234-5678
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  평일 10:00 - 18:00
                  <br />
                  (주말 및 공휴일 휴무)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink-700 py-6 text-[12.5px] sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <a key={link} href="#" className="hover:text-white">
                {link}
              </a>
            ))}
            <span>© 2026 Peer Oreum. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="text-gray-500 hover:text-white">
              <InstagramIcon />
            </a>
            <a href="#" className="text-gray-500 hover:text-white">
              <YoutubeIcon />
            </a>
            <a href="#" className="text-gray-500 hover:text-white">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
