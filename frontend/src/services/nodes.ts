import axios from "axios";

export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'

const BASE_URL = `${API_URL}/nodes`

export const getNodes = async () => (await axios.get(BASE_URL)).data
export const addNode = async (nodeId: string, name: string) => await axios.post(BASE_URL, {nodeId, name})
export const removeNode = async (nodeId: string) => await axios.delete(`${BASE_URL}/${nodeId}`)
export const setWetValue = async (nodeId: string, value: number) => await axios.post(`${BASE_URL}/${nodeId}/wet-value`, {value})
export const setDryValue = async (nodeId: string, value: number) => await axios.post(`${BASE_URL}/${nodeId}/dry-value`, {value})