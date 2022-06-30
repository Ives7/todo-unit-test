export interface User {
  id: number
  name: string
  status: number
}

export type FetchUsers = () => Promise<User[]>

export type FilterValidUsers = (users:User[]) => User[]

export type StorageUsers = (users:User[]) => void;
