export interface RankedStudent {
  rank: number
  anonId: string
  department: string
  gpa: string
  gpaPercentile: number
  lang: string
  langPercentile: number
  certs: string
  certsPercentile: number
  activity: string
  contest: string
  intern: string
}

export const RANKED_STUDENTS: RankedStudent[] = [
  {
    rank: 1,
    anonId: '익명 5231',
    department: '경영학과 4학년',
    gpa: '4.45',
    gpaPercentile: 2,
    lang: 'TOEIC 980',
    langPercentile: 3,
    certs: 'CPA',
    certsPercentile: 5,
    activity: '대외활동 4개',
    contest: '공모전 2회',
    intern: '2회',
  },
  {
    rank: 2,
    anonId: '익명 3187',
    department: '경영학과 4학년',
    gpa: '4.37',
    gpaPercentile: 3,
    lang: 'TOEIC 970',
    langPercentile: 4,
    certs: '재경관리사',
    certsPercentile: 8,
    activity: '대외활동 3개',
    contest: '공모전 1회',
    intern: '1회',
  },
  {
    rank: 3,
    anonId: '익명 7724',
    department: '경영학과 4학년',
    gpa: '4.28',
    gpaPercentile: 5,
    lang: 'AFP K',
    langPercentile: 7,
    certs: 'AFP K',
    certsPercentile: 12,
    activity: '대외활동 4개',
    contest: '공모전 1회',
    intern: '1회',
  },
  {
    rank: 4,
    anonId: '익명 9712',
    department: '경영학과 4학년',
    gpa: '4.16',
    gpaPercentile: 7,
    lang: '토익스피킹 AL',
    langPercentile: 15,
    certs: '재무분석사',
    certsPercentile: 18,
    activity: '대외활동 2개',
    contest: '-',
    intern: '-',
  },
  {
    rank: 5,
    anonId: '익명 1602',
    department: '경영학과 4학년',
    gpa: '4.05',
    gpaPercentile: 9,
    lang: 'TOEIC 930',
    langPercentile: 16,
    certs: '전산회계 1급',
    certsPercentile: 22,
    activity: '대외활동 3개',
    contest: '-',
    intern: '1회',
  },
  {
    rank: 6,
    anonId: '익명 6048',
    department: '경영학과 4학년',
    gpa: '3.98',
    gpaPercentile: 11,
    lang: 'TOEIC 920',
    langPercentile: 20,
    certs: '재경관리사',
    certsPercentile: 25,
    activity: '대외활동 2개',
    contest: '-',
    intern: '-',
  },
  {
    rank: 7,
    anonId: '익명 8891',
    department: '경영학과 4학년',
    gpa: '3.90',
    gpaPercentile: 15,
    lang: '토익스피킹 IM2',
    langPercentile: 35,
    certs: 'CS Leaders',
    certsPercentile: 35,
    activity: '대외활동 2개',
    contest: '-',
    intern: '1회',
  },
]

export const TOTAL_STUDENTS = 128
export const MY_PERCENTILE = 23
