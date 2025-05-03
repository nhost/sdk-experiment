'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNhost } from '../lib/nhost-provider';
import { formatFileSize } from '../lib/utils';

// Define the File type based on the GraphQL schema
interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  bucketId: string;
  uploadedByUserId: string;
}

export default function UploadFiles() {
  const { nhost, session, loading: authLoading } = useNhost();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{message: string, isError: boolean} | null>(null);

  // Redirect if not authenticated - always call this hook
  useEffect(() => {
    if (!authLoading) {
      if (session) {
        setIsAuthenticated(true);
      } else {
        router.push('/signin?redirectTo=/upload');
      }
    }
  }, [session, authLoading, router]);

  // Fetch files on component mount and after upload - always call this hook
  useEffect(() => {
    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated]);

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

  // If still loading or not authenticated, show loading state
  if (authLoading || !isAuthenticated) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Function to handle viewing a file with proper authorization
  const handleViewFile = async (fileId: string, fileName: string, mimeType: string) => {
    setViewingFile(fileId);

    try {
      // Fetch the file with authentication using the SDK
      const response = await nhost.storage.getFile(fileId, {}, {
        responseType: 'blob'
      });

      // Create a URL for the blob
      const blob = response.data as Blob;
      const url = URL.createObjectURL(blob);

      // Handle different file types appropriately
      if (mimeType.startsWith('image/') || mimeType === 'application/pdf' || mimeType.startsWith('text/') || mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
        // For media types that browsers can display natively, just open in a new tab
        window.open(url, '_blank');
      } else {
        // For other file types, trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Open a small window to inform the user about the download
        const newWindow = window.open('', '_blank', 'width=400,height=200');
        if (newWindow) {
          newWindow.document.write(`
            <html>
            <head>
              <title>File Download</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              </style>
            </head>
            <body>
              <h3>Downloading: ${fileName}</h3>
              <p>Your download has started. You can close this window.</p>
            </body>
            </html>
          `);
          newWindow.document.close();
        }
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
      const response = await nhost.storage.uploadFiles({
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

  // Function to handle deleting a file
  const handleDeleteFile = async (fileId: string) => {
    if (!fileId || deleting) return;

    setDeleting(fileId);
    setError(null);
    setDeleteStatus(null);

    // Get the file name for the status message
    const fileToDelete = files.find(file => file.id === fileId);
    const fileName = fileToDelete?.name || 'File';

    try {
      // Delete the file using the Nhost storage SDK with the correct method name
      const response = await nhost.storage.deleteFile(fileId);

      // Show success message
      setDeleteStatus({
        message: `${fileName} deleted successfully`,
        isError: false
      });

      // The operation was successful if we get here without an error
      // Refresh the file list
      await fetchFiles();

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    } catch (err: any) {
      // Show error message
      setDeleteStatus({
        message: `Failed to delete ${fileName}: ${err.message}`,
        isError: true
      });
      console.error('Error deleting file:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">File Upload</h1>

      <div className="glass-card p-8 mb-6">
        <h2 className="text-2xl mb-4">Upload a File</h2>

        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              border: 0
            }}
            aria-hidden="true"
            tabIndex={-1}
          />
          <div
            className="file-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="text-sm mb-2" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p>Click to select a file</p>
            {selectedFile && (
              <p style={{ color: 'var(--primary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {uploadResult && (
          <div className="alert alert-success">
            File uploaded successfully!
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="btn btn-primary w-full"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-2xl mb-6">Your Files</h2>

        {deleteStatus && (
          <div className={`alert ${deleteStatus.isError ? 'alert-error' : 'alert-success'} mb-4`}>
            {deleteStatus.message}
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-center">No files uploaded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{file.mimeType}</td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleViewFile(file.id, file.name, file.mimeType)}
                          disabled={viewingFile === file.id}
                          className="action-icon action-icon-view"
                          title="View File"
                        >
                          {viewingFile === file.id ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 6v6"></path>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          disabled={deleting === file.id}
                          className="action-icon action-icon-delete"
                          title="Delete File"
                        >
                          {deleting === file.id ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 6v6"></path>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                              <path d="M10 11v6M14 11v6"></path>
                            </svg>
                          )}
                        </button>
                      </div>
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
