'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  column: string
  created: string
}

const columns = ['todo', 'in-progress', 'done']

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      if (data.success) {
        setTasks(data.items || [])
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTaskTitle,
          status: 'todo',
          column: 'todo' 
        })
      })

      const data = await res.json()
      if (data.success) {
        setTasks([...tasks, data.item])
        setNewTaskTitle('')
        setShowForm(false)
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await res.json()
      if (data.success) {
        setTasks(tasks.map(t => t.id === taskId ? data.item : t))
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const getColumnTasks = (column: string) => 
    tasks.filter(t => t.column === column || t.status === column)

  const getColumnTitle = (column: string) => {
    const titles: { [key: string]: string } = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    }
    return titles[column] || column
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📋 Task Kanban</h1>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="text-center text-xl">Loading tasks...</div>
      ) : (
        <>
          <div className="mb-4">
            {showForm ? (
              <form onSubmit={createTask} className="bg-white p-4 rounded-lg shadow flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="New task title..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Add
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                + New Task
              </button>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map(column => (
              <div key={column} className="flex-1 min-w-[300px] bg-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 capitalize">
                  {getColumnTitle(column)} ({getColumnTasks(column).length})
                </h2>

                <div className="space-y-2">
                  {getColumnTasks(column).map(task => (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        const newColumn = columns[(columns.indexOf(column) + 1) % columns.length]
                        updateTask(task.id, { column: newColumn })
                      }}
                    >
                      <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm">{task.description}</p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(task.id)
                          }}
                          className="ml-auto text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
