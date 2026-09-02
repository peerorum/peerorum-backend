import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MyPageLayout from '../../layouts/MyPageLayout'

const GRADE_OPTIONS = ['1학년', '2학년', '3학년', '4학년']

export default function PersonalInfoEditPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '유경',
    nickname: '열정펭귄',
    email: 'marketing@dankook.ac.kr',
    school: '단국대학교',
    department: '경영학과',
    grade: '4학년',
    desiredJob: '마케팅',
  })

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/mypage/settings/account')
  }

  return (
    <MyPageLayout>
      <div>
        <h1 className="text-[22px] font-bold text-ink-900">개인정보 수정</h1>
        <p className="mt-1 text-[13.5px] text-gray-500">
          프로필에 표시되는 기본 정보를 수정할 수 있어요.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-black/[0.02]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
              익명 이름 (닉네임)
            </label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => update('nickname', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] outline-none focus:border-blue-500"
            />
            <p className="mt-1 text-[11.5px] text-gray-400">
              스펙 비교 시 다른 학생들에게 보여지는 이름이에요.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">이메일</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">학교</label>
            <input
              type="text"
              value={form.school}
              onChange={(e) => update('school', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">학과</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => update('department', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">학년</label>
            <select
              value={form.grade}
              onChange={(e) => update('grade', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] text-ink-900 outline-none focus:border-blue-500"
            >
              {GRADE_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-gray-500">
              희망 직무
            </label>
            <input
              type="text"
              value={form.desiredJob}
              onChange={(e) => update('desiredJob', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[13.5px] outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => navigate('/mypage/settings/account')}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-[13.5px] font-medium text-ink-900 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700"
          >
            저장하기
          </button>
        </div>
      </form>
    </MyPageLayout>
  )
}
