import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNhost } from '../NhostContext';

// Define the File type based on the GraphQL schema
interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  bucketId: string;
  uploadedByUserId: string;
}

export function UploadFiles() {
  const { nhost } = useNhost();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  
  // GraphQL query to fetch files
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // @ts-ignore - GraphQL client exists but TypeScript might not know about it
      const response = await nhost.graphql.query({
        query: `
          query GetFiles {
            files {
              id
              name
              size
              mimeType
              bucketId
              uploadedByUserId
            }
          }
        `
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      setFiles(response.data.data.files);
    } catch (err: any) {
      setError(`Failed to load files: ${err.message}`);
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch files on component mount and after upload
  useEffect(() => {
    fetchFiles();
  }, []);

  // Function to handle viewing a file with proper authorization
  const handleViewFile = async (fileId: string, fileName: string, mimeType: string) => {
    setViewingFile(fileId);
    
    try {
      // Properly use the SDK with responseType: 'blob'
      const response = await nhost.storage.getFilesId(fileId, {}, {
        responseType: 'blob'
      });
      
      // The response.data is already a Blob, but need to cast for TypeScript
      const blob = response.data as Blob;
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Open the file in a new tab with appropriate handling based on file type
      const newWindow = window.open('', '_blank');
      
      if (!newWindow) {
        throw new Error('Failed to open new window. Please check your popup blocker settings.');
      }
      
      // Show loading message
      newWindow.document.write('<html><body><h2>Processing file...</h2></body></html>');
      
      // Handle different file types appropriately
      if (mimeType.startsWith('image/')) {
        // For images, display in the window
        newWindow.document.write(`
          <html>
          <head>
            <title>${fileName}</title>
          </head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
            <img src="${url}" alt="${fileName}" style="max-width: 100%; max-height: 100vh;">
          </body>
          </html>
        `);
      } else if (mimeType === 'application/pdf') {
        // For PDFs, redirect to the blob URL
        newWindow.location.href = url;
      } else if (mimeType.startsWith('text/')) {
        // For text files, read and display the content
        const text = await (blob as Blob).text();
        newWindow.document.write(`
          <html>
          <head>
            <title>${fileName}</title>
            <style>
              pre { white-space: pre-wrap; word-wrap: break-word; padding: 20px; }
            </style>
          </head>
          <body>
            <pre>${text}</pre>
          </body>
          </html>
        `);
      } else {
        // For other file types, trigger download
        newWindow.document.write(`
          <html>
          <head>
            <title>File Download</title>
          </head>
          <body>
            <h2>Downloading file: ${fileName}</h2>
            <p>Your download should begin automatically. If it doesn't, <a href="${url}" download="${fileName}">click here</a>.</p>
          </body>
          </html>
        `);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      setError(`Failed to view file: ${err.message}`);
      console.error('Error viewing file:', err);
    } finally {
      setViewingFile(null);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      setError(null);
      setUploadResult(null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Upload file using Nhost storage
      const response = await nhost.storage.postFiles({
        'bucket-id': 'default',
        'file[]': [selectedFile]
      });
      
      setUploadResult(response.data.processedFiles?.[0]);
      setSelectedFile(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh file list after upload
      fetchFiles();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };
  
  const handleNavigateToHome = () => {
    navigate('/');
  };
  
  // Function to format file size in a readable way
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  return (
    <div className="content-container">
      <h1>Upload Files</h1>
      <p>Upload files to your Nhost storage bucket</p>
      
      <div className="form-group">
        <label htmlFor="file-upload" className="form-label">Select a file:</label>
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="form-input"
        />
      </div>
      
      {fileName && (
        <div className="selected-file">
          <p>Selected file: {fileName}</p>
        </div>
      )}
      
      <div className="action-buttons">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={uploading ? 'button-disabled' : ''}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        <button onClick={handleNavigateToHome} className="button-secondary">
          Back to Home
        </button>
        <button onClick={fetchFiles} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Files'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {uploadResult && (
        <div className="success-message">
          <h2>File Uploaded Successfully!</h2>
          <div className="file-details">
            <p><strong>File ID:</strong> {uploadResult.id}</p>
            <p><strong>Name:</strong> {uploadResult.name}</p>
            <p><strong>Size:</strong> {uploadResult.size} bytes</p>
            <p><strong>MIME Type:</strong> {uploadResult.mimeType}</p>
          </div>
        </div>
      )}
      
      {/* File List Section */}
      <div className="files-section">
        <h2>Uploaded Files</h2>
        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p>No files found. Upload your first file!</p>
        ) : (
          <div className="files-grid">
            <table className="files-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>{file.mimeType}</td>
                    <td>
                      <button
                        onClick={() => handleViewFile(file.id, file.name, file.mimeType)}
                        disabled={viewingFile === file.id}
                        className="view-button"
                      >
                        {viewingFile === file.id ? 'Loading...' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 