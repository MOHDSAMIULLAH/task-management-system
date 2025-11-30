import axios from "axios"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true },
          )
          const { accessToken, refreshToken: newRefreshToken } = response.data
          setTokens(accessToken, newRefreshToken)

          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          clearTokens()
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          return Promise.reject(refreshError)
        }
      } else {
        clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  },
)

export default api
