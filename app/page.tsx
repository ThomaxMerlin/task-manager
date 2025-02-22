import TaskList from "@/components/TaskList"
import AddTaskForm from "@/components/AddTaskForm"
import ThemeToggle from "@/components/ThemeToggle"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
        <ThemeToggle />
      </div>
      <AddTaskForm />
      <TaskList />
    </main>
  )
}

