import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api/moisture_level'

export const getById = async (id: string) => await axios.get(`${BASE_URL}/${id}`)