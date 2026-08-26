import { api } from './axios'

export interface MyCertificateData {
  id: number
  certName: string
  certNo: string
  issueDate: string
  status: string
  fileUrl: string
}

export interface MyActivityData {
  id: number
  activityName: string
  authKey: string
  status: string
  fileUrl: string
}

export interface MyProfileData {
  name: string
  university: string
  major: string
  entranceYear: number
  gpa: number
  toeicScore: number
  opicGrade: string
  toeicSpeakingGrade: string
  desiredJob: string
  certificates: MyCertificateData[]
  activities: MyActivityData[]
}

export const fetchMyProfile = async (): Promise<MyProfileData> => {
  const response = await api.get('/profiles/me')
  return response.data.data
}
