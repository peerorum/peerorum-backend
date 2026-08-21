import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Globe2,
  Info,
  Plus,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import MyPageLayout from '../../layouts/MyPageLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/axios'

type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'buttongroup' | 'file'

interface FieldConfig {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: string[]
  required?: boolean
}

interface CategoryConfig {
  key: string
  icon: typeof GraduationCap
  title: string
  description: string
  addLabel: string
  fields: FieldConfig[]
}

const GRADE_OPTIONS = ['1학년', '2학년', '3학년', '4학년']

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'gpa',
    icon: GraduationCap,
    title: '학점 정보 입력',
    description: '백분율/4.5 만점 기준으로 입력해주세요.',
    addLabel: '학점 추가',
    fields: [
      { key: 'scoreType', label: '점수 방식', type: 'select', options: ['4.5 만점', '4.3 만점', '100점 만점'] },
      { key: 'gpa', label: '학점', type: 'number', required: true, placeholder: '4.29' },
      { key: 'percentile', label: '백분율 (환산)', type: 'number', placeholder: '95.3' },
      { key: 'majorAverage', label: '전공 평균 (선택)', type: 'number', placeholder: '3.85' },
      { key: 'grade', label: '이수 학년', type: 'select', options: GRADE_OPTIONS, required: true },
      { key: 'file', label: '증명서 첨부', type: 'file' },
    ],
  },
  {
    key: 'language',
    icon: Globe2,
    title: '어학 성적 입력',
    description: '보유한 어학 성적을 입력해주세요.',
    addLabel: '어학 성적 추가',
    fields: [
      { key: 'test', label: '시험 종류', type: 'select', options: ['TOEIC', 'TOEIC Speaking', 'OPIc', 'TOEFL', 'IELTS'] },
      { key: 'score', label: '점수', type: 'text', required: true, placeholder: '예) 900, IH' },
      { key: 'date', label: '취득일', type: 'date' },
      { key: 'file', label: '성적표 첨부', type: 'file' },
    ],
  },
  {
    key: 'certificate',
    icon: Award,
    title: '자격증 입력',
    description: '보유한 자격증을 입력해주세요.',
    addLabel: '자격증 추가',
    fields: [
      { key: 'name', label: '자격증명', type: 'text', required: true, placeholder: '예) ADsP' },
      { key: 'certNo', label: '자격번호', type: 'text', placeholder: '예) 21-02-000000' },
      { key: 'issuer', label: '발급기관', type: 'text', placeholder: '예) 한국데이터산업진흥원' },
      { key: 'date', label: '취득일', type: 'date' },
      { key: 'file', label: '자격증명서 첨부', type: 'file' },
    ],
  },
  {
    key: 'activity',
    icon: Briefcase,
    title: '대외활동 입력',
    description: '대외활동 및 봉사활동 경험을 입력해주세요.',
    addLabel: '대외활동 추가',
    fields: [
      { key: 'name', label: '활동명', type: 'text', required: true, placeholder: '예) 마케팅 서포터즈 3기' },
      { key: 'period', label: '활동 기간', type: 'text', placeholder: '예) 2024.03 - 2024.11' },
      { key: 'detail', label: '주요 내용', type: 'textarea', placeholder: '수행한 역할과 성과를 간단히 적어주세요.' },
      { key: 'file', label: '수료증/활동증명서 첨부', type: 'file' },
    ],
  },
  {
    key: 'intern',
    icon: Users,
    title: '인턴 경험 입력',
    description: '인턴 경험을 입력해주세요.',
    addLabel: '인턴 경험 추가',
    fields: [
      { key: 'company', label: '회사명', type: 'text', required: true, placeholder: '예) ABC 마케팅' },
      { key: 'period', label: '근무 기간', type: 'text', placeholder: '예) 2024.06 - 2024.08' },
      { key: 'detail', label: '주요 업무', type: 'textarea', placeholder: '담당했던 업무를 간단히 적어주세요.' },
      { key: 'file', label: '수료증/경력증명서 첨부', type: 'file' },
    ],
  },
  {
    key: 'award',
    icon: Trophy,
    title: '수상 입력',
    description: '수상 경험을 입력해주세요.',
    addLabel: '수상 추가',
    fields: [
      { key: 'name', label: '수상명', type: 'text', required: true, placeholder: '예) 마케팅 아이디어 공모전 장려상' },
      { key: 'host', label: '주최기관', type: 'text', placeholder: '예) 한국마케팅협회' },
      { key: 'date', label: '수상일', type: 'date' },
      { key: 'file', label: '상장 첨부', type: 'file' },
    ],
  },
]

const GUIDE_ITEMS = [
  '정확한 정보를 입력해주세요.',
  '증빙자료 기반으로 인증되면 신뢰도 높은 비교가 가능해요.',
  '등록한 스펙은 전체 수정이 가능해요.',
  '등록한 스펙은 안전하게 보호돼요.',
]

type Entry = Record<string, any>

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: any
  onChange: (value: any) => void
}) {
  if (field.type === 'textarea') {
    return (
      <textarea
        rows={2}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] outline-none placeholder:text-gray-400 focus:border-blue-500"
      />
    )
  }

  if (field.type === 'select') {
    return (
      <select
        value={value || field.options?.[0] || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-ink-900 outline-none focus:border-blue-500"
      >
        {field.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'buttongroup') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {field.options?.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-lg border px-2.5 py-2 text-[12px] font-medium transition-colors ${
              value === option
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    )
  }

  if (field.type === 'file') {
    const file = value as File | undefined
    return (
      <div className="flex w-full items-center">
        {!file ? (
          <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <span>파일 선택</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => onChange(e.target.files?.[0])}
            />
          </label>
        ) : (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="group flex w-full items-center justify-center rounded-lg bg-blue-50 px-3 py-2 text-[12px] font-bold text-blue-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="block group-hover:hidden">선택완료</span>
            <span className="hidden items-center gap-1 group-hover:flex">
              <X className="h-3.5 w-3.5" /> 삭제하기
            </span>
          </button>
        )}
      </div>
    )
  }

  return (
    <input
      type={field.type}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] outline-none placeholder:text-gray-400 focus:border-blue-500"
    />
  )
}

export default function SpecRegisterPage() {
  const navigate = useNavigate()
  const { setHasSpec } = useAuth()

  const [entries, setEntries] = useState<Record<string, Entry[]>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.key, []])),
  )

  const isEntryComplete = (category: CategoryConfig, entry: Entry) =>
    category.fields
      .filter((field) => field.required)
      .every((field) => (entry[field.key] ?? '').trim().length > 0)

  const completeCountByCategory = (category: CategoryConfig) =>
    entries[category.key].filter((entry) => isEntryComplete(category, entry)).length

  const totalCompleteEntries = CATEGORIES.reduce(
    (sum, category) => sum + completeCountByCategory(category),
    0,
  )

  const addEntry = (categoryKey: string) => {
    setEntries((prev) => ({ ...prev, [categoryKey]: [...prev[categoryKey], {}] }))
  }

  const removeEntry = (categoryKey: string, index: number) => {
    setEntries((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey].filter((_, i) => i !== index),
    }))
  }

  const updateEntry = (categoryKey: string, index: number, fieldKey: string, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map((entry, i) =>
        i === index ? { ...entry, [fieldKey]: value } : entry,
      ),
    }))
  }

  const setVerificationStatus = (categoryKey: string, index: number, status: 'NONE' | 'LOADING' | 'VERIFIED' | 'REJECTED') => {
    setEntries((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey].map((entry, i) =>
        i === index ? { ...entry, _verificationStatus: status } : entry,
      ),
    }))
  }

  const handleVerifyEntry = async (category: CategoryConfig, entry: Entry, index: number) => {
    if (!isEntryComplete(category, entry)) return

    const file = entry['file'] as File | undefined
    if (!file) {
      alert('증빙 이미지를 첨부해주세요.')
      return
    }

    setVerificationStatus(category.key, index, 'LOADING')

    try {
      const formData = new FormData()
      formData.append('file', file)

      let res
      if (category.key === 'certificate') {
        const certName = entry['name']
        const certNo = entry['certNo']
        const reqBlob = new Blob([JSON.stringify({ certName, certNo, issueDate: entry['date'] || null })], { type: 'application/json' })
        formData.append('request', reqBlob)
        res = await api.post('/verification/certificate', formData)
      } else if (category.key === 'activity') {
        const reqBlob = new Blob([JSON.stringify({ activityName: entry['name'], authKey: 'N/A' })], { type: 'application/json' })
        formData.append('request', reqBlob)
        res = await api.post('/verification/activity', formData)
      } else if (category.key === 'gpa') {
        const reqBlob = new Blob([JSON.stringify({
          gpa: Number(entry['gpa']),
          scoreType: entry['scoreType'] || '4.5 만점',
          percentile: entry['percentile'] ? Number(entry['percentile']) : null,
          majorAverage: entry['majorAverage'] ? Number(entry['majorAverage']) : null
        })], { type: 'application/json' })
        formData.append('request', reqBlob)
        res = await api.post('/verification/gpa', formData)
      } else if (category.key === 'language') {
        const reqBlob = new Blob([JSON.stringify({
          testName: entry['test'] || 'TOEIC',
          score: entry['score'],
          date: entry['date'] || null
        })], { type: 'application/json' })
        formData.append('request', reqBlob)
        res = await api.post('/verification/language', formData)
      }

      if (res?.data?.data?.status === 'VERIFIED') {
        setVerificationStatus(category.key, index, 'VERIFIED')
      } else {
        setVerificationStatus(category.key, index, 'REJECTED')
        alert('인증 실패: 이미지 속 정보가 일치하지 않거나 글씨를 인식할 수 없습니다.')
        setVerificationStatus(category.key, index, 'NONE')
      }
    } catch (err) {
      console.error('Verification failed', err)
      alert('인증 처리 중 서버 오류가 발생했습니다.')
      setVerificationStatus(category.key, index, 'NONE')
    }
  }

  const handleSubmit = async () => {
    if (totalCompleteEntries === 0) return

    try {
      // Loop through categories and upload
      const uploadPromises: Promise<any>[] = []

      CATEGORIES.forEach((category) => {
        entries[category.key].forEach((entry) => {
          if (!isEntryComplete(category, entry)) return
          if (entry._verificationStatus === 'VERIFIED') return

          const file = entry['file'] as File | undefined
          if (!file) return

          const formData = new FormData()
          formData.append('file', file)

          // Depending on category, hit different endpoint
          if (category.key === 'certificate' || category.key === 'language') {
            const certName = entry['name'] || entry['test']
            const certNo = entry['certNo'] || entry['score']
            const reqBlob = new Blob([JSON.stringify({ certName, certNo, issueDate: entry['date'] || null })], {
              type: 'application/json',
            })
            formData.append('request', reqBlob)
            uploadPromises.push(api.post('/verification/certificate', formData))
          } else {
            const reqBlob = new Blob([JSON.stringify({ activityName: entry['name'] || entry['company'] || entry['host'], authKey: 'N/A' })], {
              type: 'application/json',
            })
            formData.append('request', reqBlob)
            uploadPromises.push(api.post('/verification/activity', formData))
          }
        })
      })

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises)
        alert('증명서 검증 요청이 성공적으로 접수되었습니다!')
      }

      setHasSpec(true)
      navigate('/mypage/specs')
    } catch (err) {
      console.error('Failed to submit specs', err)
      alert('스펙 등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <MyPageLayout>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-ink-900">스펙 등록하기</h1>
          <p className="mt-1 text-[13.5px] text-gray-500">
            나의 스펙을 등록하고 다른 학생들과 비교해보세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/mypage/specs')}
          className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-gray-400 hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
          등록 취소
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category, index) => {
          const filled = completeCountByCategory(category) > 0
          return (
            <div key={category.key} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold ${
                    filled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {filled ? <CheckCircle2 className="h-4.5 w-4.5" /> : index + 1}
                </span>
                <span className="whitespace-nowrap text-[11.5px] font-medium text-gray-500">
                  {category.title.replace(' 정보 입력', '').replace(' 성적 입력', '').replace(' 경험 입력', '').replace(' 입력', '')}
                </span>
              </div>
              {index < CATEGORIES.length - 1 && <div className="mb-4 h-px w-6 bg-gray-200" />}
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          {CATEGORIES.map((category) => {
            const rowFields = category.fields.filter((f) => f.type !== 'textarea')
            const textareaFields = category.fields.filter((f) => f.type === 'textarea')

            return (
              <div
                key={category.key}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-black/[0.02]"
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <category.icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-[14.5px] font-bold text-ink-900">{category.title}</h3>
                  </div>
                </div>
                <p className="text-[12.5px] text-gray-400">{category.description}</p>

                {entries[category.key].length > 0 && (
                  <div className="mt-4 flex flex-col gap-4">
                    {entries[category.key].map((entry, index) => (
                      <div
                        key={index}
                        className={index > 0 ? 'border-t border-gray-100 pt-4' : ''}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
                            {category.title.replace(' 입력', '')} {index + 1}
                            {!isEntryComplete(category, entry) && (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-semibold text-amber-600">
                                필수 항목을 입력해주세요
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            {(category.key === 'certificate' || category.key === 'activity' || category.key === 'gpa' || category.key === 'language') && (
                              <button
                                type="button"
                                onClick={() => handleVerifyEntry(category, entry, index)}
                                disabled={entry._verificationStatus === 'LOADING' || !isEntryComplete(category, entry)}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  entry._verificationStatus === 'VERIFIED'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                    : entry._verificationStatus === 'LOADING'
                                    ? 'border-gray-200 bg-gray-50 text-gray-400'
                                    : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                {entry._verificationStatus === 'VERIFIED' ? (
                                  <><CheckCircle2 className="h-3.5 w-3.5" /> 인증 완료</>
                                ) : entry._verificationStatus === 'LOADING' ? (
                                  'AI 분석 중...'
                                ) : (
                                  <><ShieldCheck className="h-3.5 w-3.5" /> AI 인증하기</>
                                )}
                              </button>
                            )}
                            {entries[category.key].length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEntry(category.key, index)}
                                aria-label="삭제"
                                className="text-gray-300 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns: `repeat(${rowFields.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {rowFields.map((field) => (
                            <div key={field.key}>
                              <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-gray-500">
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                              </label>
                              <FieldInput
                                field={field}
                                value={entry[field.key] ?? ''}
                                onChange={(value) => updateEntry(category.key, index, field.key, value)}
                              />
                            </div>
                          ))}
                        </div>

                        {textareaFields.map((field) => (
                          <div key={field.key} className="mt-3">
                            <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-gray-500">
                              {field.label}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <FieldInput
                              field={field}
                              value={entry[field.key] ?? ''}
                              onChange={(value) => updateEntry(category.key, index, field.key, value)}
                            />
                          </div>
                        ))}

                        {entries[category.key].length === 1 && !isEntryComplete(category, entry) && (
                          <p className="mt-2 text-[11.5px] font-medium text-amber-600">
                            * 표시된 필수 항목을 입력해주세요.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => addEntry(category.key)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-[12.5px] font-medium text-ink-900 hover:bg-gray-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {category.addLabel}
                  </button>
                </div>
              </div>
            )
          })}

          <button
            type="button"
            disabled={totalCompleteEntries === 0}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            등록하기
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[12px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            필수 항목(*)을 채워야 등록에 반영돼요. 입력한 정보는 검토 후 안전하게 보호돼요.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-black/[0.02]">
            <p className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-ink-900">
              <Info className="h-4 w-4 text-blue-600" />
              안내사항
            </p>
            <ul className="flex flex-col gap-2">
              {GUIDE_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[12px] text-gray-500">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-black/[0.02]">
            <p className="mb-3 text-[13px] font-bold text-ink-900">등록 진행 상황</p>
            <ul className="flex flex-col gap-2.5">
              {CATEGORIES.map((category, index) => {
                const filled = completeCountByCategory(category) > 0
                return (
                  <li key={category.key} className="flex items-center gap-2.5 text-[12.5px]">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold ${
                        filled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={filled ? 'font-medium text-ink-900' : 'text-gray-400'}>
                      {category.title.replace(' 정보 입력', '').replace(' 성적 입력', '').replace(' 경험 입력', '').replace(' 입력', '')}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </MyPageLayout>
  )
}
