export interface Task {
  id: string
  title: string
  completed: boolean
}

export interface TasksResponse {
  tasks: Task[]
  nextCursor: string | null
}

