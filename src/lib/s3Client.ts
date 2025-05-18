import { createPresignedUrl, getPublicUrl } from "@/lib/s3Actions";

/**
 * Uploads a file to S3 bucket using a pre-signed URL
 *
 * @param file - File object from file input or drag-and-drop
 * @returns Promise resolving to the public URL of the uploaded file, or null if upload failed
 *
 * Client-side function that works with server actions to handle secure uploads
 */
export async function uploadToS3(file: File | null): Promise<string | null> {
  // Return null if no file is provided
  if (!file) {
    return null;
  }

  try {
    // Get filename and encode special characters
    const fileName = encodeURI(file.name);

    // Get pre-signed URL from server action
    const presignedUrl = await createPresignedUrl(fileName, file.type);

    // Set up headers for the upload
    const headers = new Headers({
      "Content-Type": file.type,
    });

    // Upload directly to S3 using the pre-signed URL
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: headers,
      body: file,
    });

    // Check if upload was successful
    if (!uploadResponse.ok) {
      console.error("Upload failed:", await uploadResponse.text());
      return null;
    }

    // Return the public URL for the uploaded file
    return getPublicUrl(fileName);
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

/**
 * Extracts the object key (filename) from an S3 URL
 *
 * @param url - S3 URL to parse
 * @returns Extracted object key/filename
 *
 * Utility function for processing S3 URLs when needed
 */
export function extractObjectKeyFromUrl(url: string): string {
  try {
    // Parse the URL to extract components
    const parsedUrl = new URL(url);

    // Split the pathname and get the last segment (filename)
    const pathSegments = parsedUrl.pathname.split("/");
    const objectKey = pathSegments[pathSegments.length - 1];

    // Return decoded key to handle special characters
    return decodeURI(objectKey);
  } catch (error) {
    console.error("Error extracting object key:", error);
    return "";
  }
}
