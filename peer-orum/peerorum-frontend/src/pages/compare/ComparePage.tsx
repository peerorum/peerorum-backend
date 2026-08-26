import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import CompareRequireSpecPage from './CompareRequireSpecPage'
import CompareSpec2Page from './CompareSpec2Page'
import { fetchMyProfile } from '../../api/profile'

export default function ComparePage() {
  const { user, setHasSpec } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyProfile()
      .then(() => setHasSpec(true))
      .catch(() => setHasSpec(false))
      .finally(() => setLoading(false))
  }, [setHasSpec])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (user?.hasSpec) {
    return <CompareSpec2Page />
  }

  return <CompareRequireSpecPage />
}
