import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  restrictToVerticalAxis,
  restrictToParentElement
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit3, Trash2, Check, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { z } from 'zod'

import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask
} from '../../features/task/useTasks'
import { useProject } from "../../features/project/project.api"


const schema = z.object({
  title: z.string().min(1),
  notes: z.string().optional(),
  status: z.number().optional()
})

export default function TasksPage() {
  const { projectId } = useParams()

  const [newTask, setNewTask] = useState({ title: '', notes: '' })
  const [editingId, setEditingId] = useState(null)
  const [orderedTasks, setOrderedTasks] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const inputRef = useRef(null)

  const { data: project, isLoading } = useProject(projectId)
  const { data: tasks = [] } = useTasks(projectId)
  const create = useCreateTask(projectId)
  const update = useUpdateTask(projectId)
  const remove = useDeleteTask(projectId)

  useEffect(() => {
    setOrderedTasks(tasks)
  }, [tasks])

  const handleCreate = () => {
    const result = schema.safeParse({ ...newTask, status: 0 })
    if (!result.success) {
      setHasError(true)
      return
    }
    
    setHasError(false)
    create.mutate(result.data, {
      onSuccess: () => {
        setNewTask({ title: '', notes: '' })
        inputRef.current?.focus()
      }
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCreate()
    }
  }

  const handleTitleChange = (e) => {
    const value = e.target.value
    setNewTask((t) => ({ ...t, title: value }))
    if (hasError && value.trim()) {
      setHasError(false)
    }
  }

  const handleSave = (task, newTitle, newNotes) => {
    const result = schema.safeParse({ title: newTitle, notes: newNotes, status: task.status })
    if (!result.success) return console.log('Title is required')
    update.mutate({ id: task.id, ...result.data }, {
      onSuccess: () => {
        setEditingId(null)
      }
    })
  }

  const handleStatusToggle = (task) => {
    const newStatus = task.status === 2 ? 0 : 2
    update.mutate({ 
      id: task.id, 
      title: task.title, 
      notes: task.notes, 
      status: newStatus 
    }, {
      onSuccess: () => console.log('Task status updated')
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-0.5 max-w-[700px] mx-auto mt-5 px-2 mb-6"
    >
      {/* project detail */}
      {project && (
        <div className="rounded-lg overflow-hidden bg-gradient-backdropy backdrop-blur-[24px] text-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between space-x-1">
              <h1 className="text-md">{project.title}</h1>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-white/70 p-1">{Math.round(parseFloat(project.progress))}%</span>
                {/* go to canvas */}
                <Link to={`/app/project/${project.id}/drawing`} className='stroke-white/70 hover:text-white transition-all duration-200 hover:bg-white/20 rounded-lg'>
                  <div className='p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/></svg>
                  </div>
                </Link>
                {/* expand */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-white/70 hover:text-white transition-all duration-200 hover:bg-white/20 rounded-lg"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm leading-relaxed mb-3">{project.description}</p>
                <div className="text-xs text-white/70 font-medium">
                  {new Date(project.startDate).toLocaleDateString()} {project.endDate && ` — ${new Date(project.endDate).toLocaleDateString()}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Task */}
      <div className='pb-3'>
        <div className="relative">
          <input
            ref={inputRef}
            value={newTask.title}
            onChange={handleTitleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                if (!newTask.title.trim() && !newTask.notes.trim()) {
                  setIsFocused(false)
                }
              }, 150)
            }}
            onKeyDown={handleKeyDown}
            placeholder={hasError ? "Title is required" : "Add a task"}
            className={`w-full bg-gradient-backdropy backdrop-blur-[24px] text-white px-4 py-2.5 border-none rounded-lg outline-none transition-all duration-200 ${
              hasError 
                ? 'placeholder-red' 
                : ''
            } ${
              isFocused
                ? 'rounded-b-none'
                : 'rounded-b-lg'
            }`}
          />
          
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  value={newTask.notes}
                  onChange={(e) => setNewTask((t) => ({ ...t, notes: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  placeholder="Add notes (optional)"
                  className="w-full px-4 py-1 bg-gradient-backdropy backdrop-blur-[24px] text-white rounded-lg rounded-t-none outline-none resize-none transition-colors duration-200 border-t border-white/50"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Task List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id && over) {
            const oldIndex = orderedTasks.findIndex((t) => t.id === active.id)
            const newIndex = orderedTasks.findIndex((t) => t.id === over.id)
            const reordered = arrayMove(orderedTasks, oldIndex, newIndex)
            setOrderedTasks(reordered)

            // Update all positions in batch
            reordered.forEach((task, index) => {
              update.mutate({
                id: task.id,
                title: task.title,
                notes: task.notes,
                status: task.status,
                position: index
              })
            })
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
              handleStatusToggle={handleStatusToggle}
              handleDelete={() => remove.mutate(task.id, {
                onSuccess: () => console.log('Task deleted')
              })}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* no tasks */}
      {tasks.length === 0 && (
        <div className="text-center py-12 text-white/80">
          <p className="text-sm">No tasks yet</p>
        </div>
      )}

    </motion.div>
  )
}

function SortableTaskItem({
  task,
  editingId,
  setEditingId,
  handleSave,
  handleStatusToggle,
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
    opacity: isDragging ? 0.6 : 1
  }

  const isEditing = editingId === task.id
  const [localTitle, setLocalTitle] = useState(task.title)
  const [localNotes, setLocalNotes] = useState(task.notes)
  const isDone = task.status === 2

  useEffect(() => {
    if (!isEditing) {
      setLocalTitle(task.title)
      setLocalNotes(task.notes)
    }
  }, [isEditing, task])

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-3 text-white outline-none border-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-gradient-backdropy backdrop-blur-[24px] rounded-lg shadow-sm p-2 transition-all duration-200 hover:shadow-lg ${
          isDone ? 'opacity-70' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox */}
          <button
            onClick={() => handleStatusToggle(task)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isDone 
                ? 'bg-main-blue border-main-blue hover:bg-main-blue/80' 
                : 'border-white/40 hover:border-white/60 hover:bg-white/10'
            }`}
          >
            {isDone && (
              <Check size={12} className="text-white" />
            )}
          </button>

          <div
            {...listeners}
            className="mt-1 hover:text-sky-500 cursor-grab active:cursor-grabbing select-none"
          >
            <GripVertical size={18} />
          </div>

          {/* editing */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <>
                <input
                  value={localTitle}
                  placeholder='title'
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="w-full px-3 py-0.5 bg-white/20 outline-none border-none rounded-lg"
                />
                <input
                  value={localNotes}
                  placeholder='description'
                  onChange={(e) => setLocalNotes(e.target.value)}
                  className="w-full mt-2 px-3 py-0.5 bg-white/20 outline-none border-none rounded-lg resize-none"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(task, localTitle, localNotes)}
                    className="flex items-center justify-center gap-1 w-20 py-1 bg-main-blue hover:bg-main-blue/70 text-white rounded-lg text-xs transition-colors"
                  >
                    <Check size={12} />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center justify-center gap-1 w-20 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors"
                  >
                    <X size={12} />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className={`font-medium mb-1 ${isDone ? 'line-through text-white/60' : ''}`}>
                  {task.title}
                </h3>
                {task.notes && (
                  <p className={`text-sm ${isDone ? 'text-white/40' : 'text-white/70'}`}>
                    {task.notes}
                  </p>
                )}
              </>
            )}
          </div>

          {/* delete & edit btn */}
          {!isEditing && (
            <div className="flex gap-1 self-center">
              <button
                onClick={() => setEditingId(task.id)}
                className="p-2 text-white hover:bg-white/20 rounded-md"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-white hover:bg-red/20 hover:text-red rounded-md"
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