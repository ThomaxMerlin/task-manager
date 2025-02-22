import type { Task, TasksResponse } from "@/types"

// Load tasks from localStorage or use default if empty
let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]")

if (tasks.length === 0) {
  tasks = [
    { id: "1", title: "Learn React", completed: false },
    { id: "2", title: "Build a task manager", completed: false },
    { id: "3", title: "Deploy to Vercel", completed: false },
  ]
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Simulating API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchTasks({ pageParam = 0, filter = "all" }): Promise<TasksResponse> {
  await delay(500) // Simulate network delay
  const pageSize = 10
  const start = pageParam * pageSize
  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.completed === (filter === "completed"))
  const pagedTasks = filteredTasks.slice(start, start + pageSize)
  return {
    tasks: pagedTasks,
    nextCursor: start + pageSize < filteredTasks.length ? String(pageParam + 1) : null,
  }
}

export async function addTask(newTask: { title: string }): Promise<Task> {
  await delay(500)
  const task: Task = {
    id: String(Date.now()),
    title: newTask.title,
    completed: false,
  }
  tasks.push(task)
  localStorage.setItem("tasks", JSON.stringify(tasks))
  return task
}

export async function updateTask(updatedTask: Task): Promise<Task> {
  await delay(500)
  const index = tasks.findIndex((t) => t.id === updatedTask.id)
  if (index !== -1) {
    tasks[index] = updatedTask
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }
  return updatedTask
}

export async function deleteTask(taskId: string): Promise<void> {
  await delay(500)
  tasks = tasks.filter((t) => t.id !== taskId)
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

