import axios from "axios";

export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'

const BASE_URL = `${API_URL}/nodes`

export const getNodes = async () => (await axios.get(BASE_URL)).data