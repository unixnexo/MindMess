import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit3, Trash2, Check, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask
} from '../../features/task/useTasks'

const schema = z.object({
  title: z.string().min(1),
  notes: z.string().optional()
})

export default function TasksPage() {
  const { projectId } = useParams()

  const [newTask, setNewTask] = useState({ title: '', notes: '' })
  const [editingId, setEditingId] = useState(null)
  const [orderedTasks, setOrderedTasks] = useState([])

  const { data: tasks = [] } = useTasks(projectId)
  const create = useCreateTask(projectId)
  const update = useUpdateTask(projectId)
  const remove = useDeleteTask(projectId)

  useEffect(() => {
    setOrderedTasks(tasks)
  }, [tasks])

  const handleCreate = () => {
    const result = schema.safeParse(newTask)
    if (!result.success) return console.log('Title is required')
    create.mutate(result.data, {
      onSuccess: () => {
        setNewTask({ title: '', notes: '' })
        console.log('Task added')
      }
    })
  }

  const handleSave = (task, newTitle, newNotes) => {
    const result = schema.safeParse({ title: newTitle, notes: newNotes })
    if (!result.success) return console.log('Title is required')
    update.mutate({ id: task.id, ...result.data }, {
      onSuccess: () => {
        setEditingId(null)
        console.log('Task updated')
      }
    })
  }

  const sensors = useSensors(useSensor(PointerSensor))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Add New Task */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Add New Task</h2>
        <input
          value={newTask.title}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, title: e.target.value }))
          }
          placeholder="Title"
          className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
        />
        <textarea
          value={newTask.notes}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, notes: e.target.value }))
          }
          placeholder="Notes (optional)"
          className="w-full mb-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none"
          rows={2}
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = orderedTasks.findIndex((t) => t.id === active.id)
            const newIndex = orderedTasks.findIndex((t) => t.id === over.id)
            setOrderedTasks(arrayMove(orderedTasks, oldIndex, newIndex))
            // TODO: persist order to backend if needed
          }
        }}
      >
        <SortableContext
          items={orderedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedTasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              editingId={editingId}
              setEditingId={setEditingId}
              handleSave={handleSave}
              handleDelete={() => remove.mutate(task.id, {
                onSuccess: () => console.log('Task deleted')
              })}
            />
          ))}
        </SortableContext>
      </DndContext>
    </motion.div>
  )
}

function SortableTaskItem({
  task,
  editingId,
  setEditingId,
  handleSave,
  handleDelete
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  }

  const isEditing = editingId === task.id
  const [localTitle, setLocalTitle] = useState(task.title)
  const [localNotes, setLocalNotes] = useState(task.notes)

  useEffect(() => {
    if (!isEditing) {
      setLocalTitle(task.title)
      setLocalNotes(task.notes)
    }
  }, [isEditing, task])

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-3">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-sm border p-4 transition-all duration-200 hover:shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div
            {...listeners}
            className="mt-1 text-gray-400 hover:text-sky-500 cursor-grab active:cursor-grabbing select-none"
          >
            <GripVertical size={18} />
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <>
                <input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                />
                <textarea
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(task, localTitle, localNotes)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-500 text-white rounded-lg text-sm"
                  >
                    <Check size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                {task.notes && (
                  <p className="text-sm text-gray-600">{task.notes}</p>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1">
              <button
                onClick={() => setEditingId(task.id)}
                className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
