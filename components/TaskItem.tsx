"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Task } from "@/types"
import { updateTask, deleteTask } from "@/lib/api"
import { motion } from "framer-motion"
import { Pencil, Trash2, CheckCircle, Circle } from "lucide-react"

export default function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const handleUpdate = () => {
    updateMutation.mutate({ ...task, title: editedTitle })
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteMutation.mutate(task.id)
  }

  const handleToggleComplete = () => {
    updateMutation.mutate({ ...task, completed: !task.completed })
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center space-x-2 mb-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center space-x-4 mb-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <button onClick={handleToggleComplete} className="focus:outline-none">
        {task.completed ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-400" />
        )}
      </button>
      <span
        className={`flex-grow ${
          task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"
        }`}
      >
        {task.title}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 text-yellow-500 hover:text-yellow-600 transition-colors focus:outline-none"
      >
        <Pencil className="w-5 h-5" />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-red-500 hover:text-red-600 transition-colors focus:outline-none"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

