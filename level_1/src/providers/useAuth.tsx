import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

//Custom Hook
export const useAuth = () => useContext(AuthContext)
