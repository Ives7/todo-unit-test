import { FetchUsers, FilterValidUsers, StorageUsers, User } from "./domains";
import axios from "axios";

export const fetchUsers:FetchUsers = async ()=> {
  try {
    const response = await axios.get<User[]>('/users')
    return response.data || []
  }catch (e) {
    throw new Error("api error")
  }
}

export const filterValidUsers:FilterValidUsers = (users) => {
  return users.filter((user,index) => {
    if(!user) {
      throw new Error(`has dirty data,index at ${index}`)
    }
    return user.status === 1
  })
}

export const storageUsers:StorageUsers = (users) => {
  localStorage.setItem('users',JSON.stringify(users))
}


export const cacheUsers = async () => {
  let users = await fetchUsers()
  users = filterValidUsers(users);
  storageUsers(users);
}
