import { useRef, useEffect, useState } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDrawing, saveDrawing } from '../../features/drawing/drawing.api'
import { useParams } from 'react-router-dom'
import Spinner from '../../components/ui/Spinner'

const colors = ['#000000', '#FF3B30', '#007AFF']

const DrawingPage = () => {
  const { projectId } = useParams()
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [eraserMode, setEraserMode] = useState(false)
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  const { data, isLoading } = useQuery({
    queryKey: ['drawing', projectId],
    queryFn: () => getDrawing(projectId),
    retry: false,
    refetchOnWindowFocus: false,
  })

  const { mutate: save, isPending } = useMutation({
    mutationFn: (json) => {
      const method = data?.canvasData ? 'put' : 'post';
      return saveDrawing(projectId, json, method);
    }
  });

  useEffect(() => {
    if (data?.canvasData && canvasRef.current) {
      try {
        const parsed = JSON.parse(data.canvasData)
        canvasRef.current.loadPaths(parsed)
      } catch (err) {
        console.error("Failed to load drawing:", err)
      }
    }
  }, [data])

  const handleSave = async () => {
    const paths = await canvasRef.current?.exportPaths()
    save(JSON.stringify(paths))
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    setEraserMode(false)
  }

  const handleClear = () => canvasRef.current?.clearCanvas()

  const handleEraser = () => setEraserMode(true)

  const handleMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left click
      e.preventDefault()
      setIsDragging(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, lastMousePos])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex items-center gap-1 text-black/80">
          <Spinner />
          <span className='pt-0.5'>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-white overflow-hidden *:select-none ${isFullscreen ? 'top-0' : 'top-11'}`}>
      {/* Top Toolbar */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border border-gray-200/50">
          <div className="flex items-center gap-4">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
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

            <div className="w-px h-6 bg-gray-300"></div>
            {/* Color Palette */}
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    selectedColor === color && !eraserMode 
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* Stroke Width */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 font-medium">Size</div>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            {/* Tools */}
            <button
              onClick={handleEraser}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                eraserMode
                  ? 'bg-red-100 text-red-600 ring-1 ring-red-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Eraser
            </button>

            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Canvas Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            width: '200vw',
            height: '200vh',
            position: 'absolute',
            left: '-50vw',
            top: '-50vh'
          }}
        >
          <ReactSketchCanvas
            ref={canvasRef}
            style={{ 
              border: 'none',
              borderRadius: '0px',
              width: '200vw',
              height: '200vh',
              cursor: isDragging ? 'grabbing' : 'crosshair'
            }}
            width="200vw"
            height="200vh"
            strokeWidth={strokeWidth}
            strokeColor={eraserMode ? '#FFFFFF' : selectedColor}
            canvasColor="#FFFFFF"
            backgroundImage=""
          />
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg transition-all duration-200 ${
            isPending ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            'Save'
          )}
        </button>
      </div>

      {/* <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style> */}
    </div>
  )
}

export default DrawingPage
