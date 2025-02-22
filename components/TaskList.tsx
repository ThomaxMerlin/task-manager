"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import TaskItem from "./TaskItem"
import type { Task } from "@/types"
import { fetchTasks } from "@/lib/api"
import { AnimatePresence } from "framer-motion"
import SkeletonLoader from "./SkeletonLoader"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

export default function TaskList() {
  const { ref, inView } = useInView()
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [tasks, setTasks] = useState<Task[]>([])

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } = useInfiniteQuery(
    {
      queryKey: ["tasks", filter],
      queryFn: ({ pageParam = 0 }) => fetchTasks({ pageParam, filter }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  useEffect(() => {
    refetch()
  }, [filter, refetch])

  useEffect(() => {
    if (data) {
      const allTasks = data.pages.flatMap((page) => page.tasks)
      setTasks(allTasks)
    }
  }, [data])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "completed" | "pending")}
          className="p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {status === "pending" ? (
        <SkeletonLoader />
      ) : status === "error" ? (
        <div className="text-red-500 dark:text-red-400">Error: {error.message}</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TaskItem task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div ref={ref} className="mt-4 text-center">
        {isFetchingNextPage ? (
          <SkeletonLoader />
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Load More
          </button>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No more tasks to load</p>
        )}
      </div>
      {isFetching && !isFetchingNextPage && <SkeletonLoader />}
    </div>
  )
}

