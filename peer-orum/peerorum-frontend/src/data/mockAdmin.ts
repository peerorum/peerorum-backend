export const SIGNUP_TREND = [
  { date: '05.13', count: 98 },
  { date: '05.14', count: 142 },
  { date: '05.15', count: 165 },
  { date: '05.16', count: 188 },
  { date: '05.17', count: 206 },
  { date: '05.18', count: 224 },
  { date: '05.19', count: 198 },
]

export const GENDER_DISTRIBUTION = [
  { label: '남성', value: 1239, percent: 48.7, strokeClass: 'stroke-blue-600', dotClass: 'bg-blue-600' },
  { label: '여성', value: 1258, percent: 49.5, strokeClass: 'stroke-rose-300', dotClass: 'bg-rose-300' },
  { label: '기타', value: 46, percent: 1.8, strokeClass: 'stroke-gray-300', dotClass: 'bg-gray-300' },
]

export const RECENT_SIGNUPS = [
  { name: '김단국', handle: '@dankook_kim', time: '5분 전' },
  { name: '이피어', handle: '@peer_lee', time: '12분 전' },
  { name: '오름이', handle: '@oreum_o', time: '18분 전' },
  { name: '박성장', handle: '@growth_park', time: '25분 전' },
  { name: '최스펙', handle: '@spec_choi', time: '31분 전' },
]

export const ADMIN_USERS = [
  { name: '김민준', id: 'minjun_kim', school: '서울대학교', major: '컴퓨터공학부', grade: '3학년', joinedAt: '2025.05.19', status: '활성' as const, verified: '인증완료' as const },
  { name: '이서연', id: 'seoyeon_lee', school: '연세대학교', major: '경영학과', grade: '2학년', joinedAt: '2025.05.18', status: '활성' as const, verified: '인증완료' as const },
  { name: '박지훈', id: 'jihoon_park', school: '고려대학교', major: '데이터사이언스학부', grade: '4학년', joinedAt: '2025.05.17', status: '활성' as const, verified: '인증완료' as const },
  { name: '최수빈', id: 'subin_choi', school: '성균관대학교', major: '소프트웨어학과', grade: '3학년', joinedAt: '2025.05.16', status: '휴면' as const, verified: '인증완료' as const },
  { name: '정우성', id: 'woosung_jung', school: '한양대학교', major: '전자공학부', grade: '2학년', joinedAt: '2025.05.15', status: '휴면' as const, verified: '인증대기' as const },
  { name: '김하늘', id: 'haneul_kim', school: '이화여자대학교', major: '심리학과', grade: '1학년', joinedAt: '2025.05.14', status: '활성' as const, verified: '인증대기' as const },
  { name: '오태현', id: 'taehyun_oh', school: '중앙대학교', major: '경영경제학부', grade: '3학년', joinedAt: '2025.05.13', status: '정지' as const, verified: '인증완료' as const },
  { name: '강민지', id: 'minji_kang', school: '부산대학교', major: '화학공학과', grade: '4학년', joinedAt: '2025.05.12', status: '활성' as const, verified: '인증완료' as const },
  { name: '조유진', id: 'yujin_cho', school: '경희대학교', major: '미디어커뮤니케이션학과', grade: '2학년', joinedAt: '2025.05.11', status: '휴면' as const, verified: '인증대기' as const },
  { name: '한승재', id: 'seungjae_han', school: '건국대학교', major: '산업공학과', grade: '3학년', joinedAt: '2025.05.10', status: '정지' as const, verified: '인증완료' as const },
]

export const ADMIN_VERIFICATIONS = [
  { name: '김단국', handle: '@dankook_kim', type: '성적증명서', file: '성적증명서_2025_1학기.pdf', submittedAt: '2025.05.19 14:32', status: '대기 중' as const },
  { name: '이미어', handle: '@peer_lee', type: '어학성적표', file: 'TOEIC_780.pdf', submittedAt: '2025.05.19 13:18', status: '대기 중' as const },
  { name: '오름이', handle: '@oreum_o', type: '자격증', file: '정보처리기사.pdf', submittedAt: '2025.05.19 11:47', status: '대기 중' as const },
  { name: '박성장', handle: '@growth_park', type: '대외활동', file: '활동증명서_피어오름.pdf', submittedAt: '2025.05.19 10:22', status: '대기 중' as const },
  { name: '최스펙', handle: '@spec_choi', type: '인턴경력', file: '인턴경력증명서.pdf', submittedAt: '2025.05.19 09:15', status: '대기 중' as const },
  { name: '정성실', handle: '@sungsil_jung', type: '봉사활동', file: '봉사활동확인서.pdf', submittedAt: '2025.05.18 21:33', status: '대기 중' as const },
  { name: '한미래', handle: '@future_han', type: '어학성적표', file: 'OPIc_IH.pdf', submittedAt: '2025.05.18 18:40', status: '대기 중' as const },
]

export const ADMIN_SUSPENSIONS = [
  { name: '김민준', id: 'minjun_kim', school: '서울대학교', type: '정지' as const, reason: '부적절한 게시글', requestedAt: '2025.05.19 14:32', status: '대기 중' as const },
  { name: '이서연', id: 'seoyeon_lee', school: '연세대학교', type: '정지' as const, reason: '허위 정보 등록', requestedAt: '2025.05.19 13:18', status: '처리 완료' as const },
  { name: '박지훈', id: 'jihoon_park', school: '고려대학교', type: '탈퇴' as const, reason: '서비스 이용 중단', requestedAt: '2025.05.19 11:47', status: '검토 중' as const },
  { name: '최수빈', id: 'subin_choi', school: '성균관대학교', type: '탈퇴' as const, reason: '개인정보 우려', requestedAt: '2025.05.19 10:22', status: '대기 중' as const },
  { name: '정우성', id: 'woosung_jung', school: '한양대학교', type: '정지' as const, reason: '부적절한 게시글', requestedAt: '2025.05.19 09:15', status: '처리 완료' as const },
  { name: '김하늘', id: 'haneul_kim', school: '이화여자대학교', type: '탈퇴' as const, reason: '서비스 이용 중단', requestedAt: '2025.05.18 21:33', status: '검토 중' as const },
  { name: '오태현', id: 'taehyun_oh', school: '중앙대학교', type: '정지' as const, reason: '중복 계정', requestedAt: '2025.05.18 18:40', status: '대기 중' as const },
]
