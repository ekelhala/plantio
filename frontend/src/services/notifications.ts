import axios, { AxiosResponse } from "axios";

export const API_URL: string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'

const BASE_URL = `${API_URL}/notifications`

export const createNotification = async (nodeId: string, percentage: number) => await axios.post(BASE_URL, {nodeId, percentage})
export const getNotifications = async () => await axios.get(BASE_URL)
export const deleteNotification = async (id: string) => await axios.delete(`${BASE_URL}/${id}`)