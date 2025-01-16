import axios from "axios";

export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'

const BASE_URL = `${API_URL}/auth`

export const getUser = async () => await axios.get(`${BASE_URL}/whoami`)
export const login = async (email: string, password: string) => await axios.post(`${BASE_URL}/login`, {email, password})
export const logout = async () => await axios.post(`${BASE_URL}/logout`, null, {withCredentials:true})
export const register = async(email: string, name: string, password: string) => await axios.post(`${BASE_URL}/register`, {email, password, name})
