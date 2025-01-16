import axios from "axios";

export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'

const BASE_URL = `${API_URL}/nodes`

export const getNodes = async () => (await axios.get(BASE_URL)).data
export const addNode = async (nodeId: string) => await axios.post(BASE_URL, {nodeId})
export const removeNode = async (nodeId: string) => await axios.delete(`${BASE_URL}/${nodeId}`)