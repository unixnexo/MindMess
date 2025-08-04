import { useRef, useEffect, useState } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDrawing, saveDrawing } from '../../features/drawing/drawing.api'
import { useParams } from 'react-router-dom'

const colors = ['black', 'red', 'blue']

const DrawingPage = () => {

  const { projectId } = useParams()
  const canvasRef = useRef(null)
  const [selectedColor, setSelectedColor] = useState('black')
  const [eraserMode, setEraserMode] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['drawing', projectId],
    queryFn: () => getDrawing(projectId),
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Project Drawing</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color && !eraserMode ? 'border-black' : 'border-transparent'
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button className="btn-default" onClick={handleClear}>Clear</button>
            <button
              className={`btn-default ${eraserMode ? 'ring-2 ring-red-500' : ''}`}
              onClick={handleEraser}
            >
              Eraser
            </button>
          </div>

          <ReactSketchCanvas
            ref={canvasRef}
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
            width="100%"
            height="500px"
            strokeWidth={4}
            strokeColor={eraserMode ? '#FFFFFF' : selectedColor}
          />

          <button
            className="btn-primary mt-4"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Drawing'}
          </button>
        </>
      )}
    </div>
  )
}

export default DrawingPage
