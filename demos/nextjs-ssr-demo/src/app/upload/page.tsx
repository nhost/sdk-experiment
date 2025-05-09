import { createServerNhostClient } from "../lib/nhost/ssr";
import UploadClient from "./client";

// Define the File type based on the GraphQL schema
export interface StorageFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  bucketId: string;
  uploadedByUserId: string;
}

export default async function UploadPage() {
  // Create the server client with async cookie access
  const nhost = await createServerNhostClient();

  // Fetch files on the server
  let files: StorageFile[] = [];
  let error: string | null = null;

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
      `,
    });

    if (response.body.errors) {
      throw new Error(response.body.errors[0]?.message);
    }

    files = response.body.data.files;
  } catch (err: any) {
    error = `Failed to load files: ${err.message}`;
    console.error("Error fetching files:", err);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mb-6 gradient-text">File Upload</h1>

      {/* Pass the server-fetched files to the client component */}
      <UploadClient initialFiles={files} serverError={error} />
    </div>
  );
}
