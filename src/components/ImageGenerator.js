// src/components/ImageGenerator.js

import React, { useState } from "react";
import axios from "axios";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://web-production-f8d8.up.railway.app/api/",
        { prompt },
        { responseType: "arraybuffer" }, // Ensure response is array buffer to handle image
      );

      if (response.status !== 200) {
        throw new Error("Failed to generate image");
      }

      // Convert the binary data to base64
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      setImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      setError(err.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt"
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p className="error">{error}</p>}
      {image && (
        <div>
          <h2>Preview</h2>
          <img src={image} alt="Generated" />
          <button onClick={downloadImage}>Download Image</button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
