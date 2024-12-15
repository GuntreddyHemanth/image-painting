import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const canvasRef = useRef(null);
  const [brushRadius, setBrushRadius] = useState(5);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history") || "[]")
  );

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Export the mask and original images
  const exportImages = () => {
    if (canvasRef.current && uploadedImage) {
      const maskData = canvasRef.current.getSaveData();
  
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      const image = new Image();
      image.onload = () => {
        // Set canvas size to match image size
        canvas.width = image.width;
        canvas.height = image.height;
  
        // Draw the original image onto the canvas
        ctx.drawImage(image, 0, 0);
  
        // Create a new canvas for the mask
        const maskCanvas = document.createElement("canvas");
        const maskCtx = maskCanvas.getContext("2d");
        maskCanvas.width = image.width;
        maskCanvas.height = image.height;
  
        const maskLines = JSON.parse(maskData).lines;
        maskLines.forEach((line) => {
          maskCtx.beginPath();
          line.points.forEach((point, index) => {
            if (index === 0) {
              maskCtx.moveTo(point.x, point.y);
            } else {
              maskCtx.lineTo(point.x, point.y);
            }
          });
          maskCtx.lineWidth = line.brushRadius;
          maskCtx.strokeStyle = "white"; // Mask color (white is used for removal)
          maskCtx.lineCap = "round";
          maskCtx.stroke();
        });
  
        // Apply the mask on the original image
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(maskCanvas, 0, 0);
  
        // Convert the result into a PNG URL and set it as the masked image
        const maskedImageUrl = canvas.toDataURL("image/png");
        setMaskImage(maskedImageUrl);
  
        // Export both the original and masked images
        const originalLink = document.createElement("a");
        originalLink.href = uploadedImage;
        originalLink.download = "original_image.png";
        originalLink.click();
  
        const maskLink = document.createElement("a");
        maskLink.href = maskedImageUrl;
        maskLink.download = "masked_image.png";
        maskLink.click();
      };
  
      image.src = uploadedImage; // Trigger image loading
    } else {
      console.error("Canvas or uploaded image is not available.");
    }
  };
  

  // Save images to history (fixing the issue of saving stale state)
  const saveToHistory = () => {
    if (uploadedImage && canvasRef.current) {
      const maskData = canvasRef.current.getSaveData(); // Get the latest mask data

      // Create a new canvas to merge the image and mask
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        // Create a temporary canvas for the mask
        const maskCanvas = document.createElement("canvas");
        const maskCtx = maskCanvas.getContext("2d");
        maskCanvas.width = image.width;
        maskCanvas.height = image.height;

        const maskLines = JSON.parse(maskData).lines;
        maskLines.forEach((line) => {
          maskCtx.beginPath();
          line.points.forEach((point, index) => {
            if (index === 0) {
              maskCtx.moveTo(point.x, point.y);
            } else {
              maskCtx.lineTo(point.x, point.y);
            }
          });
          maskCtx.lineWidth = line.brushRadius;
          maskCtx.strokeStyle = "white";
          maskCtx.lineCap = "round";
          maskCtx.stroke();
        });

        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(maskCanvas, 0, 0);

        const maskedImageUrl = canvas.toDataURL("image/png");
        setMaskImage(maskedImageUrl);

        // Save the current state of the uploaded image and the mask image to history
        const newHistory = [
          ...history,
          { original: uploadedImage, mask: maskedImageUrl },
        ];
        setHistory(newHistory);
        localStorage.setItem("history", JSON.stringify(newHistory));
      };
      image.src = uploadedImage;
    }
  };

  // Delete a history item
  const deleteFromHistory = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
      }}
    >
      {/* Left Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "auto",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Image Inpainting Widget</h1>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            marginBottom: "20px",
            borderRadius: "5px",
            maxWidth: "300px",
          }}
        />

        {uploadedImage && (
          <>
            <div
              style={{
                position: "relative",
                margin: "auto",
                width: "100%",
                maxWidth: "600px",
                marginBottom: "20px",
              }}
            >
              <CanvasDraw
                ref={canvasRef}
                imgSrc={uploadedImage}
                brushColor="white"
                brushRadius={brushRadius}
                lazyRadius={0}
                canvasWidth={500}
                canvasHeight={500}
                style={{ borderRadius: "8px" }}
              />
            </div>

            {/* Brush Size Slider */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "#fff", fontSize: "1rem" }}>Brush Size: </label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushRadius}
                onChange={(e) => setBrushRadius(Number(e.target.value))}
                style={{
                  width: "100%",
                  backgroundColor: "#333",
                  border: "none",
                  color: "#fff",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={exportImages}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "30%",
                  fontSize: "1rem",
                }}
              >
                Export Images
              </button>
              <button
                onClick={saveToHistory}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "30%",
                  fontSize: "1rem",
                }}
              >
                Save to History
              </button>
              <button
                onClick={() => canvasRef.current.clear()}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "30%",
                  fontSize: "1rem",
                }}
              >
                Clear Canvas
              </button>
            </div>
          </>
        )}
      </div>

      {/* History Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#1f1f1f",
          padding: "20px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>History</h2>
        {history.length > 0 ? (
          history.map((entry, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "1rem", marginBottom: "10px" }}>Entry {index + 1}</h4>
              <div>
                <img
                  src={entry.original}
                  alt="Original"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <img
                  src={entry.mask}
                  alt="Mask"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                />
                <button
                  onClick={() => deleteFromHistory(index)}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    marginTop: "10px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No history available.</p>
        )}
      </div>
    </div>
  );
};

export default App;
