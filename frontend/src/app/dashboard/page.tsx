"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, clearTokens } from "../../lib/auth"
import { useTasks } from "../../hooks/useTasks"
import TaskList from "../../components/TaskList"
import TaskForm from "../../components/TaskForm"
import Toast from "../../components/Toast"
import type { Task } from "../../types"

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks()

  useEffect(() => {
    setMounted(true)
    const checkAuth = isAuthenticated()
    setAuthenticated(checkAuth)

    if (!checkAuth) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    clearTokens()
    router.push("/login")
  }

  const handleCreateOrUpdate = async (data: Partial<Task>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data)
        setToast({ message: "Task updated successfully!", type: "success" })
      } else {
        await createTask(data)
        setToast({ message: "Task created successfully!", type: "success" })
      }
      setShowForm(false)
      setEditingTask(null)
    } catch (error) {
      setToast({ message: "Operation failed", type: "error" })
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id)
        setToast({ message: "Task deleted successfully!", type: "success" })
      } catch (error) {
        setToast({ message: "Failed to delete task", type: "error" })
      }
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleTaskStatus(id)
      setToast({ message: "Task status updated!", type: "success" })
    } catch (error) {
      setToast({ message: "Failed to update status", type: "error" })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  if (!mounted || !authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <TaskForm task={editingTask} onSubmit={handleCreateOrUpdate} onCancel={handleCancel} />
          </div>
        )}

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Tasks</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search by Title</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search tasks..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <TaskList tasks={tasks} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
      </main>
    </div>
  )
}
