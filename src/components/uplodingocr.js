import React, { useState } from "react";
import Tesseract from "tesseract.js";

export default function HandwritingRecognition() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleExtractText = () => {
    if (!selectedImage) return;

    setLoading(true);
    Tesseract.recognize(selectedImage, "eng", {
      logger: (m) => console.log(m), // shows progress
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Handwriting Recognition Game</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleExtractText} disabled={loading}>
        {loading ? "Processing..." : "Extract Text"}
      </button>

      {text && (
        <div style={{ marginTop: "20px" }}>
          <h4>Extracted Text:</h4>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}
