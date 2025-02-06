import axios, { type AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `https://${import.meta.env.VITE_BASE_URL_API}/venwallet/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
