import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  FolderOpen,
  Info,
  Link2,
  Lock,
  SquareCheck,
  Target,
} from 'lucide-react'
import Modal from '../ui/Modal'
import Stepper from '../ui/Stepper'
import { useSignupModal } from '../../context/SignupModalContext'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/axios'

type Step = 'intro' | 'basic' | 'compare' | 'terms' | 'complete'

const INTRO_STEPS = [
  {
    icon: ClipboardList,
    label: 'STEP 1',
    title: '기본 정보',
    description: '학교, 학과, 학년 정보를 입력해주세요.',
  },
  {
    icon: Target,
    label: 'STEP 2',
    title: '비교 조건 설정',
    description: '나와 비슷한 학생을 찾기 위한 비교 조건을 설정해주세요.',
  },
  {
    icon: Link2,
    label: 'STEP 3',
    title: '스펙 등록 연동',
    description: '나의 스펙을 등록하고 인증하며 성장 리포트를 준비하세요.',
  },
]

const GRADES = ['1학년', '2학년', '3학년', '4학년', '기타']

const SPEC_LINK_GUIDE = [
  { title: '마이페이지로 이동', description: '우측 상단 프로필 아이콘을 클릭하세요.' },
  { title: '내 스펙 메뉴 선택', description: "사이드 메뉴에서 '내 스펙'을 선택하세요." },
  {
    title: '스펙 항목 연동',
    description: '학점, 어학, 자격증 등 스펙을 등록하고 인증하여 비교를 시작해보세요.',
  },
]

const TERMS = [
  {
    key: 'service',
    title: '이용약관 (필수)',
    body: `제 1조 (목적)
본 약관은 대학생 스펙 인증 및 정보 공유 플랫폼(이하 "서비스")을 운영하는 운영팀(이하 "운영자")과 서비스를 이용하는 회원 간의 권리, 의무 및 책임사항과 서비스 이용에 필요한 사항을 규정함을 목적으로 합니다.

제 2조 (정의)
① "서비스"란 회원이 자신의 스펙을 등록하고 인증받아 익명으로 정보를 공유하고 비교할 수 있도록 제공되는 온라인 플랫폼을 의미합니다.
② "회원"이란 본 약관에 동의하고 회원가입을 완료하여 서비스를 이용하는 자를 말합니다.
③ "스펙정보"란 학점, 어학성적, 자격증, 대외활동, 공모전, 인턴십, 교육 이수 내역 등 회원이 등록하는 객관적인 정보를 의미합니다.
④ "증빙자료"란 스펙 정보의 사실 여부를 확인하기 위하여 회원이 제출하는 성적증명서, 자격증, 어학성적표, 활동 확인서 등의 자료를 의미합니다.
⑤ "인증"이란 운영자가 제출된 증빙자료를 검토하여 해당 스펙 정보의 사실 여부를 확인하는 절차를 의미합니다.`,
  },
  {
    key: 'privacy',
    title: '개인정보처리방침 (필수)',
    body: `제 1조 (개인정보의 처리 목적)
운영자는 다음의 목적을 위하여 개인정보를 처리합니다.
1. 회원가입 및 회원 관리
· 회원 식별 및 가입 의사 확인
· 회원 자격 유지 및 관리
· 중복 가입 및 부정 이용 방지
· 회원 문의 및 불만 처리`,
  },
  {
    key: 'certification',
    title: '스펙 인증 운영정책 (필수)',
    body: `제 1조 (목적)
본 운영정책은 피어오름(이하 "서비스")에서 제공하는 스펙 인증 서비스의 운영 기준 및 절차를 규정함으로써, 정확하고 신뢰할 수 있는 정보를 제공하는 것을 목적으로 합니다.

제 2조 (인증 대상)
회원은 다음 항목에 대하여 인증을 신청할 수 있습니다.
· 학점`,
  },
]

const WIZARD_MAX_WIDTH = 'max-w-[440px]'

function ProgressHeader({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <div className="ml-auto flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
      <span className="text-[12px] font-medium text-gray-400">
        {step}/{totalSteps}
      </span>
    </div>
  )
}

export default function SignupModal() {
  const { isOpen, initialStep, close } = useSignupModal()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(initialStep)
  const [grade, setGrade] = useState('4학년')
  const [university, setUniversity] = useState('단국대학교')
  const [major, setMajor] = useState('')
  const [desiredJob, setDesiredJob] = useState('')
  const [majors, setMajors] = useState<string[]>([])
  const [checked, setChecked] = useState<Record<string, boolean>>({
    service: true,
    privacy: true,
    certification: true,
  })

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep)
      fetch('http://localhost:8080/api/majors')
        .then((res) => res.json())
        .then((data) => setMajors(data))
        .catch((err) => console.error('Failed to fetch majors', err))
    }
  }, [isOpen, initialStep])

  const allChecked = Object.values(checked).every(Boolean)
  const toggleAll = () => {
    const next = !allChecked
    setChecked({ service: next, privacy: next, certification: next })
  }

  const handleComplete = async () => {
    try {
      // Create profile via API
      let entranceYear = 2024
      if (grade === '1학년') entranceYear = 2024
      else if (grade === '2학년') entranceYear = 2023
      else if (grade === '3학년') entranceYear = 2022
      else if (grade === '4학년') entranceYear = 2021
      else entranceYear = 2020

      await api.post('/profiles', {
        university,
        major,
        entranceYear,
        desiredJob,
      })
      setStep('complete')
    } catch (err) {
      console.error('Failed to create profile', err)
      alert('프로필 생성에 실패했습니다.')
    }
  }

  const goToLogin = () => {
    close()
    navigate('/login')
  }

  const goToMyPage = () => {
    close()
    login({ hasSpec: false })
    navigate('/mypage/specs/register')
  }

  const goToLandingIntro = () => {
    close()
    login({ hasSpec: false })
    navigate('/')
  }

  const maxWidthClassName = step === 'terms' ? 'max-w-2xl' : WIZARD_MAX_WIDTH

  return (
    <Modal open={isOpen} onClose={close} maxWidthClassName={maxWidthClassName}>
      {step === 'intro' && (
        <div>
          <div className="flex justify-end text-[13px] text-gray-400">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={goToLogin}
              className="ml-1 font-semibold text-blue-600 hover:underline"
            >
              로그인
            </button>
          </div>

          <h1 className="mt-2 text-[22px] font-bold text-ink-900">회원가입</h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            피어오름에서 나의 스펙을 관리하고 성장해보세요
          </p>

          <div className="mt-6 flex justify-center">
            <Stepper
              steps={[{ label: '기본 정보' }, { label: '비교 조건' }, { label: '스펙 연결' }]}
              currentIndex={0}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gray-50 p-4">
            {INTRO_STEPS.map((s) => (
              <div key={s.title} className="flex items-start gap-3 rounded-xl bg-white p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <s.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <span className="text-[11px] font-semibold text-blue-600">{s.label}</span>
                  <p className="text-[14px] font-semibold text-ink-900">{s.title}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-gray-500">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('basic')}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            회원가입 시작
          </button>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-gray-400">
            가입하면 서비스의 이용약관 및 개인정보처리방침에
            <br />
            동의하는 것으로 간주됩니다.
          </p>
        </div>
      )}

      {step === 'basic' && (
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('intro')}
              className="text-gray-400 hover:text-gray-600"
              aria-label="이전"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <span className="text-[14px] font-semibold text-ink-900">회원가입</span>
            <ProgressHeader step={1} totalSteps={3} />
          </div>

          <h2 className="mt-6 text-[19px] font-bold text-ink-900">기본 정보를 입력해주세요</h2>
          <p className="mt-1.5 text-[13.5px] text-gray-500">정확한 비교를 위해 필요한 정보입니다.</p>

          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              setStep('compare')
            }}
          >
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-ink-900">학교 *</label>
              <div className="relative">
                <select
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-ink-900 outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    학교를 선택해주세요
                  </option>
                  <option>단국대학교</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-ink-900">
                학과(전공) *
              </label>
              <div className="relative">
                <select
                  required
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-ink-900 outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    학과를 선택해주세요
                  </option>
                  {majors.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-ink-900">학년 *</label>
              <div className="flex flex-wrap gap-2">
                {GRADES.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setGrade(option)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                      grade === option
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              다음 →
            </button>
          </form>
        </div>
      )}

      {step === 'compare' && (
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('basic')}
              className="text-gray-400 hover:text-gray-600"
              aria-label="이전"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <span className="text-[14px] font-semibold text-ink-900">회원가입</span>
            <ProgressHeader step={2} totalSteps={3} />
          </div>

          <h2 className="mt-6 text-[19px] font-bold text-ink-900">비교 조건을 설정해주세요</h2>
          <p className="mt-1.5 text-[13.5px] text-gray-500">나와 비슷한 학생들을 추적할 수 있어요.</p>

          <form
            className="mt-6 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              setStep('terms')
            }}
          >
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-ink-900">
                희망 직무 *
              </label>
              <div className="relative">
                <select
                  required
                  value={desiredJob}
                  onChange={(e) => setDesiredJob(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-ink-900 outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    희망 직무를 선택해주세요
                  </option>
                  <option>마케팅</option>
                  <option>영업</option>
                  <option>기획</option>
                  <option>개발</option>
                  <option>디자인</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-[12.5px] leading-relaxed text-blue-700">
                선택하신 정보는 나중에 마이페이지에서 언제든지 변경하실 수 있습니다.
              </p>
            </div>

            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={() => setStep('basic')}
                className="w-full rounded-xl border border-gray-200 py-3 text-[15px] font-semibold text-ink-900 hover:bg-gray-50"
              >
                이전
              </button>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700"
              >
                다음 →
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'terms' && (
        <div>
          <div className="flex justify-center">
            <Stepper
              steps={[
                { label: '회원정보입력' },
                { label: '약관 및 정책 동의' },
                { label: '가입 완료' },
              ]}
              currentIndex={1}
            />
          </div>

          <h1 className="mt-6 text-center text-[21px] font-bold text-ink-900">
            서비스 이용을 위해 약관 및 정책에 동의해주세요
          </h1>
          <p className="mt-2 text-center text-[13.5px] text-gray-500">
            모든 약관 및 정책을 확인하신 후 동의해 주세요.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {TERMS.map((term) => (
              <div key={term.key} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 text-[14px] font-semibold text-ink-900">
                    <input
                      type="checkbox"
                      checked={checked[term.key]}
                      onChange={(e) =>
                        setChecked((prev) => ({ ...prev, [term.key]: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    {term.title}
                  </label>
                  <a href="#" className="text-[12.5px] text-gray-400 hover:text-gray-600">
                    전체보기 ↗
                  </a>
                </div>
                <div className="mt-3 h-24 overflow-y-auto whitespace-pre-line rounded-xl bg-gray-50 p-3 text-[12px] leading-relaxed text-gray-500">
                  {term.body}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleAll}
            className="mt-5 flex w-full items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5"
          >
            <span className="flex items-center gap-2 text-[13.5px] font-medium text-blue-700">
              <SquareCheck className="h-4.5 w-4.5" />
              모든 약관 및 정책에 동의합니다. (선택 포함)
            </span>
            <span
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold ${
                allChecked ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              전체 동의
            </span>
          </button>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep('compare')}
              className="w-full rounded-xl border border-gray-200 py-3 text-[15px] font-semibold text-ink-900 hover:bg-gray-50"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!allChecked}
              onClick={handleComplete}
              className="w-full rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            안전한 회원 정보 보호를 위해 SSL 암호화를 적용하고 있습니다.
          </p>
        </div>
      )}

      {step === 'complete' && (
        <div>
          <div className="flex justify-center">
            <Stepper
              steps={[
                { label: '회원정보입력' },
                { label: '약관 및 정책 동의' },
                { label: '가입 완료' },
              ]}
              currentIndex={2}
            />
          </div>

          <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FolderOpen className="h-7 w-7" />
          </span>

          <h1 className="mt-4 text-[20px] font-bold leading-snug text-ink-900">
            스펙 등록은 마이페이지에서 연동할 수 있어요!
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-gray-500">
            회원가입이 완료되었습니다.
            <br />
            메인 서비스를 이용하기 전에 내 스펙을 등록하여 더 정확한 비교와 분석을 받아보세요.
          </p>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <p className="mb-3 text-[13px] font-semibold text-ink-900">스펙 등록 방법</p>
            <div className="flex flex-col gap-3">
              {SPEC_LINK_GUIDE.map((item, index) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink-900">{item.title}</p>
                    <p className="text-[12.5px] leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={goToMyPage}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 text-[14.5px] font-semibold text-ink-900 hover:bg-gray-50"
            >
              마이페이지로 이동
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToLandingIntro}
              className="w-full rounded-xl bg-blue-600 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              서비스 둘러보기
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
