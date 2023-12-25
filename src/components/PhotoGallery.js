// App.js
import React, { useState, useEffect } from 'react';
import Upload from './Upload';

function App() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const totalSizeLimit = 10 * 1024 * 1024; // 10 MB limit per upload
  const dailyUploadLimit = 25 * 1024 * 1024; // 25 MB limit per day

  const calculateTotalSize = () => {
    return uploadedImages.reduce((acc, file) => acc + file.size, 0);
  };

  const handleUpload = (files) => {
    const currentUpload = files.reduce((acc, file) => acc + file.size, 0);
    const totalSize = calculateTotalSize() + currentUpload;

    if (totalSize > totalSizeLimit) {
      alert('Adding these files will exceed the total size limit. Remove some files and try again.');
      return;
    }

    const currentDayUpload = localStorage.getItem('currentDayUpload') || 0;
    const newDailyUpload = Number(currentDayUpload) + currentUpload;

    if (newDailyUpload > dailyUploadLimit) {
      alert('You have exceeded the daily upload limit. Please try again tomorrow.');
      return;
    }

    // Update the state with the new uploaded images
    setUploadedImages((prevImages) => [...prevImages, ...files]);

    // Update the daily upload limit in localStorage
    localStorage.setItem('currentDayUpload', newDailyUpload);
  };

  const handleDelete = (index) => {
    // Remove the image at the specified index
    setUploadedImages((prevImages) => {
      const deletedSize = prevImages[index].size;
      const currentDayUpload = localStorage.getItem('currentDayUpload') || 0;
      const newDailyUpload = Math.max(0, Number(currentDayUpload) - deletedSize);

      // Check if the date has changed
      const lastDate = localStorage.getItem('lastDate');
      const currentDate = new Date().toLocaleDateString();

      if (lastDate !== currentDate) {
        // Reset the daily upload limit if the date has changed
        localStorage.setItem('currentDayUpload', 0);
        localStorage.setItem('lastDate', currentDate);
      } else {
        // Update the daily upload limit in localStorage
        localStorage.setItem('currentDayUpload', newDailyUpload);
      }

      return prevImages.filter((_, i) => i !== index);
    });
  };

  const remainingSpace = totalSizeLimit - calculateTotalSize();
  const remainingDailyUpload = dailyUploadLimit - (localStorage.getItem('currentDayUpload') || 0);

  useEffect(() => {
    // Reset daily upload limit at the beginning of each day (for demonstration purposes, reset every 24 hours)
    const resetDailyUpload = setInterval(() => {
      localStorage.removeItem('currentDayUpload');
      localStorage.removeItem('lastDate');
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(resetDailyUpload);
  }, []);

  return (
    <div className="App" style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Photo Gallery App</h1>
        <Upload onUpload={handleUpload} totalSizeLimit={totalSizeLimit} />
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
          {uploadedImages.map((image, index) => (
            <div key={index} style={{ marginRight: '10px', border: '1px solid #ccc', padding: '10px' }}>
              <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} style={{ maxWidth: '200px' }} />
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '200px' }}>
        <h2>Remaining Space</h2>
        <p>{remainingSpace} bytes</p>
        <div style={{ height: '20px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(calculateTotalSize() / totalSizeLimit) * 100}%`,
              height: '100%',
              background: '#4caf50',
            }}
          ></div>
        </div>
        <p>{((calculateTotalSize() / totalSizeLimit) * 100).toFixed(2)}% used</p>
        <h2>Remaining Daily Upload</h2>
        <p>{remainingDailyUpload} bytes</p>
        <div style={{ height: '20px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(localStorage.getItem('currentDayUpload') / dailyUploadLimit) * 100}%`,
              height: '100%',
              background: '#4caf50',
            }}
          ></div>
        </div>
        <p>{((localStorage.getItem('currentDayUpload') / dailyUploadLimit) * 100).toFixed(2)}% used</p>
      </div>
    </div>
  );
}

export default App;
