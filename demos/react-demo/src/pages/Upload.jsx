import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthProvider';
import { nhost } from '../lib/nhost/client';

export default function Upload() {
  const { isAuthenticated, isLoading } = useAuth();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // If not authenticated or still loading, show appropriate UI
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(file => {
        return nhost.storage.uploadFile({
          file,
          bucketId: 'default', // Using default bucket
        });
      });

      const results = await Promise.all(uploadPromises);
      
      // Filter successful uploads
      const successful = results.filter(r => !r.error).map(r => r.body);
      setUploadedFiles(prev => [...prev, ...successful]);

      // Check for errors
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        setError(`${errors.length} files failed to upload`);
      }

      // Clear selected files
      setFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await nhost.storage.deleteFile({ fileId });
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Failed to delete file:', err);
      setError('Failed to delete file');
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">File Upload</h1>

      {/* Upload Form */}
      <div className="glass-card p-8 mb-6">
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="file-upload" onClick={() => document.getElementById('file-input').click()}>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto h-12 w-12 text-gray-400 mb-2"
              >
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <p className="mb-1">Click to select files</p>
              <p className="text-sm text-gray-400">{files.length > 0 ? `${files.length} files selected` : 'No files selected'}</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </form>
      </div>

      {/* Files List */}
      <div className="glass-card p-8">
        <h2 className="text-2xl mb-6">Your Files</h2>

        {uploadedFiles.length === 0 ? (
          <p className="text-center">No files uploaded yet</p>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{(file.size / 1024).toFixed(2)} KB</td>
                    <td>{file.mimeType}</td>
                    <td className="table-actions">
                      <button
                        className="action-icon action-icon-view"
                        onClick={() => {
                          const res = nhost.storage.getPublicUrl({ fileId: file.id });
                          window.open(res.publicUrl, '_blank');
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </button>
                      <button
                        className="action-icon action-icon-delete"
                        onClick={() => handleDelete(file.id)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
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