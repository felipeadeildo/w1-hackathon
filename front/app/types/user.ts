export interface Profile {
  full_name: string
}

export interface User {
  id: string
  email: string
  is_active: boolean
  is_consultant: boolean
  created_at: string
  updated_at: string
  profile: Profile
}
