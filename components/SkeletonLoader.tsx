"use client"

import { motion } from "framer-motion"

export default function SkeletonLoader() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-grow">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ))}
    </motion.div>
  )
}

