// Upload.js
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Upload = ({ onUpload, totalSizeLimit }) => {
  const onDrop = useCallback(acceptedFiles => {
    // Check if adding the new files will exceed the total size limit
    const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > totalSizeLimit) {
      alert('Adding these files will exceed the total size limit. Remove some files and try again.');
      return;
    }

    // Do something with the uploaded files
    onUpload(acceptedFiles);
  }, [onUpload, totalSizeLimit]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default Upload;
