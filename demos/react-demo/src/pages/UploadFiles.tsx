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
  const { nhost, session } = useNhost();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
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
                      <a
                        href={`${nhost.storage.axios.defaults.baseURL}/files/${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-button"
                      >
                        View
                      </a>
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