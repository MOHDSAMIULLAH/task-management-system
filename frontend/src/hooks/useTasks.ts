"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../lib/api"
import type { Task, PaginatedResponse } from "../types"
import { isAuthenticated } from "../lib/auth"

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState({
    status: "ALL",
    search: "",
  })

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated()) {
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status !== "ALL" && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      })

      const response = await api.get<PaginatedResponse<Task>>(`/tasks?${params}`)
      setTasks(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters.status, filters.search])

  useEffect(() => {
    fetchTasks()
  }, [pagination.page, pagination.limit, filters.status, filters.search])

  const createTask = async (data: Partial<Task>) => {
    const response = await api.post<Task>("/tasks", data)
    setTasks([response.data, ...tasks])
    return response.data
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    const response = await api.patch<Task>(`/tasks/${id}`, data)
    setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
    return response.data
  }

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskStatus = async (id: string) => {
    const response = await api.post<Task>(`/tasks/${id}/toggle`)
    setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
    return response.data
  }

  const getTaskById = async (id: string) => {
    const response = await api.get<Task>(`/tasks/${id}`)
    return response.data
  }

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const setLimit = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }))
  }

  return {
    tasks,
    loading,
    pagination,
    filters,
    setFilters,
    setPage,
    setLimit,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTaskById,
  }
}
