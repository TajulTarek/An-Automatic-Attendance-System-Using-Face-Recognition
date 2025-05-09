import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Camera.css';
import { cloudinaryConfig } from '../config/cloudinary';

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function Camera() {
  const [image, setImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentSessionImages, setCurrentSessionImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, []);

  const startCamera = async () => {
    try {
      setCurrentSessionImages([]); // Reset session images
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Error accessing camera: " + err.message);
    }
  };

  const stopCamera = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }

    const studentId = localStorage.getItem('ID');
    console.log('Stopping camera for student:', studentId);
    
    if (currentSessionImages.length > 0) {
      try {
        // Prepare data in the required format
        const photoData = {
          registrationNumber: studentId,
          photos: currentSessionImages.map(img => img.url)
        };

        console.log('Sending photo data:', {
          registrationNumber: photoData.registrationNumber,
          photoCount: photoData.photos.length,
          photoUrls: photoData.photos
        });

        // Get the base URL from environment variable
        const baseUrl = import.meta.env.VITE_BASE_URL;
        console.log('Using base URL:', baseUrl);

        // Send data to backend
        const response = await fetch(`${baseUrl}/student-photos/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(photoData)
        });

        // Log the response status and headers for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        // Clone the response before reading it
        const responseClone = response.clone();

        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await responseClone.json();
            errorMessage = errorData.message || 'Failed to upload photos';
          } catch (e) {
            // If response is not JSON, get the text
            const text = await responseClone.text();
            console.error('Non-JSON response:', text);
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Photos uploaded successfully:', result);
      } catch (error) {
        console.error('Error uploading photos:', error);
        setError('Error uploading photos: ' + error.message);
      }
    } else {
      console.log('No photos to upload');
    }

    // Reset current session images
    setCurrentSessionImages([]);
  };

  const capturePhoto = async () => {
    try {
      setError(null);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg');
      setImage(imageUrl);
      
      // Upload to Cloudinary
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', dataURLtoFile(imageUrl, 'photo.jpg'));
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      formData.append('cloud_name', cloudinaryConfig.cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      if (data.secure_url) {
        const progress = Math.min((uploadedImages.length + 1) * 10, 100);
        const newImg = {
          url: data.secure_url,
          timestamp: new Date().toISOString(),
          progress: progress
        };
        setUploadedImages(prev => [...prev, newImg]);
        setCurrentSessionImages(prev => [...prev, newImg]);
        if (progress === 100) {
          navigate('/student');
        }
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setError('Error uploading photo: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    try {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      throw new Error('Failed to process image');
    }
  };

  return (
    <div className="camera-page">
      <div className="camera-header">
        <h1>Student Photo Upload</h1>
        <p>Take multiple photos to improve face recognition accuracy</p>
      </div>
      <div className="camera-main">
        <div className="video-controls-column">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="video-preview"
            />
            {!isCameraActive && (
              <div className="camera-placeholder">
                <span className="camera-icon">📸</span>
                <p>Camera is not active</p>
                <button onClick={startCamera} className="start-camera-btn">
                  Start Camera
                </button>
              </div>
            )}
          </div>
          <div className="controls">
            <button 
              onClick={capturePhoto} 
              disabled={isUploading || !isCameraActive}
              className="capture-btn"
            >
              {isUploading ? (
                <>
                  <span className="loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  Take Photo
                </>
              )}
            </button>
            <button onClick={stopCamera} className="stop-btn">
              Stop Camera
            </button>
          </div>
        </div>
        <div className="uploaded-images-side">
          <h3>Uploaded Photos ({uploadedImages.length}/10)</h3>
          <div className="image-list">
            {uploadedImages.length === 0 && <div className="no-photos">No photos uploaded yet.</div>}
            {uploadedImages.map((img, index) => (
              <div key={index} className="uploaded-image-row">
                <div className="uploaded-image-thumb">
                  <img src={img.url} alt={`Uploaded ${index + 1}`} />
                  <div className="progress-badge">{img.progress}%</div>
                </div>
                <div className="uploaded-image-label">{ordinal(index + 1)} Photo</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
}

export default Camera;
