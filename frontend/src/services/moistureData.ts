import axios from "axios";

export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'

const BASE_URL = `${API_URL}/moisture_level`

export const getById = async (id: string) => await axios.get(`${BASE_URL}/${id}`)