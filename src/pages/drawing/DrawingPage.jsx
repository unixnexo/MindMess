import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { useParams, useNavigate, useBlocker } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDrawing, saveDrawing } from '../../features/drawing/drawing.api'
import Spinner from '../../components/ui/Spinner'
import Popup from '../../components/ui/Popup'

const colors = ['#000000', '#FF3B30', '#007AFF']

const DrawingPage = () => {

  const { projectId } = useParams()
  const containerRef = useRef(null)
  const stageRef = useRef(null)

  const [lines, setLines] = useState([])
  const [history, setHistory] = useState([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [eraserMode, setEraserMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showLoadErrorAlert, setShowLoadErrorAlert] = useState(false)
  const [showSaveErrorAlert, setShowSaveErrorAlert] = useState(false)
  const [showSavedIndicator, setShowSavedIndicator] = useState(false)

  const [scale, setScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [lastDist, setLastDist] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['drawing', projectId],
    queryFn: () => getDrawing(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (json) => {
      const method = data?.canvasData ? 'put' : 'post'
      return saveDrawing(projectId, json, method)
    },
    onSuccess: () => {
      setShowSavedIndicator(true)
      setTimeout(() => setShowSavedIndicator(false), 2000)
    },
    onError: () => {
      setShowSaveErrorAlert(true)
    }
  })

  useEffect(() => {
    // Only show error for non-404 errors
    if (error && error?.status !== 404 && error?.response?.status !== 404) {
      setShowLoadErrorAlert(true)
    }
  }, [error])

  useEffect(() => {
    if (data?.canvasData) {
      try {
        const loadedLines = JSON.parse(data.canvasData)
        setLines(loadedLines)
        setHistory([loadedLines])
        setHistoryIndex(0)
      } catch (err) {
        setShowLoadErrorAlert(true)
        console.error('Failed to load drawing:', err)
      }
    }
  }, [data])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault()
        redo()
      } else if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault()
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, history, isFullscreen])

  // autosave on close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (lines.length > 0) {
        save(JSON.stringify(lines))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [lines, save])

  // autosave on route change
  useBlocker(({ currentLocation, nextLocation }) => {
    if (currentLocation.pathname !== nextLocation.pathname && lines.length > 0) {
      save(JSON.stringify(lines))
    }
    return false 
  })

  const addToHistory = (newLines) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newLines)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setLines(history[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setLines(history[newIndex])
    }
  }

  const handleSave = () => {
    save(JSON.stringify(lines))
  }

  const handleMouseDown = (e) => {
    if (e.evt.button !== 0) return // only left click

    const stage = stageRef.current
    const pointer = stage.getPointerPosition()
    const transform = stage.getAbsoluteTransform().copy().invert()
    const pos = transform.point(pointer)

    setIsDrawing(true)
    stage.draggable(false)

    const newLine = {
      tool: eraserMode ? 'eraser' : 'pen',
      stroke: eraserMode ? '#ffffff' : strokeColor,
      strokeWidth,
      points: [pos.x, pos.y],
    }

    setLines((prevLines) => [...prevLines, newLine])
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return

    const stage = stageRef.current
    const pointer = stage.getPointerPosition()
    const transform = stage.getAbsoluteTransform().copy().invert()
    const pos = transform.point(pointer)

    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines

      const lastLine = prevLines[prevLines.length - 1]
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, pos.x, pos.y],
      }

      return [...prevLines.slice(0, -1), updatedLine]
    })
  }

  const handleMouseUp = () => {
    if (isDrawing) {
      addToHistory([...lines])
    }
    setIsDrawing(false)
    stageRef.current.draggable(true)
  }

  const handleWheel = (e) => {
    e.evt.preventDefault()
    const scaleBy = 1.05
    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const direction = e.evt.deltaY > 0 ? -1 : 1
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

    setScale(newScale)
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    })
  }

  const handleTouchStart = (e) => {
    if (e.evt.touches.length === 1) {
      // Single touch - draw
      const stage = stageRef.current
      const touch = e.evt.touches[0]
      const pointer = { x: touch.clientX, y: touch.clientY }
      const transform = stage.getAbsoluteTransform().copy().invert()
      const pos = transform.point(pointer)

      setIsDrawing(true)
      stage.draggable(false)

      const newLine = {
        tool: eraserMode ? 'eraser' : 'pen',
        stroke: eraserMode ? '#ffffff' : strokeColor,
        strokeWidth,
        points: [pos.x, pos.y],
      }

      setLines((prevLines) => [...prevLines, newLine])
    }
  }

  const handleTouchMove = (e) => {
    if (e.evt.touches.length === 2) {
      const [touch1, touch2] = e.evt.touches
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )

      if (lastDist) {
        const scaleBy = dist / lastDist
        const stage = stageRef.current
        const newScale = scale * scaleBy
        setScale(newScale)
      }

      setLastDist(dist)
    } else if (e.evt.touches.length === 1 && isDrawing) {
      // Single touch - draw
      const stage = stageRef.current
      const touch = e.evt.touches[0]
      const pointer = { x: touch.clientX, y: touch.clientY }
      const transform = stage.getAbsoluteTransform().copy().invert()
      const pos = transform.point(pointer)

      setLines((prevLines) => {
        if (prevLines.length === 0) return prevLines

        const lastLine = prevLines[prevLines.length - 1]
        const updatedLine = {
          ...lastLine,
          points: [...lastLine.points, pos.x, pos.y],
        }

        return [...prevLines.slice(0, -1), updatedLine]
      })
    }
  }

  const handleTouchEnd = () => {
    if (isDrawing) {
      addToHistory([...lines])
      setIsDrawing(false)
      stageRef.current.draggable(true)
    }
    setLastDist(null)
  }

  const zoom = (factor) => {
    const newScale = scale * factor
    setScale(newScale)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex items-center gap-1 text-black/80">
          <Spinner />
          <span className="pt-0.5">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-white overflow-hidden *:select-none ${isFullscreen ? 'top-0' : 'top-11'}`}>
      {/* Top Toolbar */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 w-full md:w-auto px-2 md:px-0 z-10 ${isFullscreen ? 'top-0' : 'top-4'}`}>
        <div className="bg-white/90 hide-scrollbar overflow-x-auto md:overflow-visible backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-gray-200/50">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setStrokeColor(color)
                    setEraserMode(false)
                  }}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${strokeColor === color && !eraserMode ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300" />

            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 font-medium">Size</div>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={() => setEraserMode(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${eraserMode ? 'bg-red-100 text-red-600 ring-1 ring-red-200' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Eraser
            </button>

            <button
              onClick={() => {
                setLines([])
                setHistory([[]])
                setHistoryIndex(0)
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Clear
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              Undo
            </button>

            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              Redo
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="absolute inset-0">
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          scaleX={scale}
          scaleY={scale}
          x={stagePos.x}
          y={stagePos.y}
          draggable={!isDrawing}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ background: '#fff', cursor: isDrawing ? 'crosshair' : 'default' }}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Zoom Buttons */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-1 shadow-lg border border-gray-200/50">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => zoom(1.2)}
              className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-xl transition-all duration-200"
            >
              +
            </button>
            <button
              onClick={() => {
                setScale(1)
                setStagePos({ x: 0, y: 0 })
              }}
              className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-sm transition-all duration-200"
            >
              1:1
            </button>
            <button
              onClick={() => zoom(1 / 1.2)}
              className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-xl transition-all duration-200"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`px-6 py-1.5 bg-main-blue hover:bg-main-blue/80 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg transition-all duration-200 ${isPending ? 'cursor-not-allowed' : ''
            }`}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : showSavedIndicator ? (
            'Saved'
          ) : (
            'Save'
          )}
        </button>
      </div>

      {showLoadErrorAlert && (
        <Popup
          variant="alert"
          open={showLoadErrorAlert}
          onOpenChange={setShowLoadErrorAlert}
          description="A server error occurred. Please try again."
          confirmText="Try Again"
          onConfirm={() => {
            setShowLoadErrorAlert(false);
            window.location.reload();
          }}
        />
      )}

      {showSaveErrorAlert && (
        <Popup
          variant="alert"
          open={showSaveErrorAlert}
          onOpenChange={setShowSaveErrorAlert}
          description="Failed to save drawing. Please try again."
          confirmText="Try Again"
          onConfirm={() => {
            setShowSaveErrorAlert(false);
          }}
        />
      )}

    </div>
  )
}

export default DrawingPage