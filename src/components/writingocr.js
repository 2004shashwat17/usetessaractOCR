import React, { useRef, useState } from "react";
import Tesseract from "tesseract.js";

export default function WhiteboardOCR() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState("");

  // Initialize Canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; // background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctxRef.current = ctx;
  }, []);

  // Start drawing
  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Draw
  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  // OCR Processing
  const handleOCR = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png"); // convert to image
    Tesseract.recognize(image, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setResult(text.trim());
      })
      .catch((err) => console.error(err));
  };

  // Clear board
  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, 500, 300);
    ctxRef.current.fillStyle = "white";
    ctxRef.current.fillRect(0, 0, 500, 300);
    setResult("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Handwriting Recognition Whiteboard</h2>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleOCR}>Check Text</button>
        <button onClick={clearCanvas} style={{ marginLeft: "10px" }}>
          Clear
        </button>
      </div>
      {result && (
        <p style={{ marginTop: "10px" }}>
          <strong>Recognized Text:</strong> {result}
        </p>
      )}
    </div>
  );
}
