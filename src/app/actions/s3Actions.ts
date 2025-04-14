"use server";

import { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client with credentials from environment variables
// Client runs only on server side and keeps credentials secure
const s3Client = new S3Client({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY as string,
    secretAccessKey: process.env.IAM_SECRET_KEY as string,
  },
});

/**
 * Creates a pre-signed URL for uploading directly to S3
 *
 * @param key - Object key (filename) to use in S3
 * @param contentType - MIME type of file being uploaded
 * @returns Pre-signed URL valid for 1 hour
 *
 * Security benefit: Client can upload directly to S3 without needing AWS credentials
 * Performance benefit: Uploads go directly to S3 instead of through our server
 */
export const createPresignedUrl = async (key: string, contentType: string) => {
  // Create command to put an object in the S3 bucket
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: key,
    ContentType: contentType, // Sets proper MIME type for the file
  });

  // Generate temporary signed URL that expires in 1 hour
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

/**
 * Gets a list of all images in the S3 bucket
 *
 * @returns Array of public URLs for all images in bucket
 *
 * Used for displaying existing images in selection UI
 */
export async function listImages() {
  // Create command to list objects in the bucket
  const command = new ListObjectsCommand({
    Bucket: process.env.S3_BUCKET_NAME as string,
    Delimiter: "/", // Use delimiter to list only top-level objects
  });

  // Send command to AWS
  const response = await s3Client.send(command);

  // Return empty array if bucket is empty
  if (!response.Contents) {
    return [];
  }

  // Transform S3 objects into public URLs
  const imageUrls = response.Contents.filter((item) => item.Key) // Filter out any undefined keys
    .map((item) => {
      // URL encode the filename to handle special characters
      const fileName = encodeURI(item.Key as string);
      // Construct the full URL using the S3 URL pattern
      return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;
    });

  return imageUrls;
}

/**
 * Removes an image from S3 using its URL
 *
 * @param url - Full S3 URL of image to delete
 * @returns Boolean indicating success or failure
 *
 * Used when deleting images from the image selection UI
 */
export async function removeImage(url: string) {
  try {
    // Parse the URL to extract the object key
    const parsedUrl = new URL(url);
    // Split the path and get the last segment (the filename)
    const pathSegments = parsedUrl.pathname.split("/");
    // Decode the URI component to handle special characters
    const key = decodeURI(pathSegments[pathSegments.length - 1]);

    // Create command to delete the object
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: key,
    });

    // Send the delete command to AWS
    await s3Client.send(command);
    return true;
  } catch (err) {
    // Log error and return false to indicate failure
    console.error("Error removing image:", err);
    return false;
  }
}

/**
 * Generates a public URL for an uploaded file
 *
 * @param fileName - Name of file in S3 bucket
 * @returns Public URL to access the file
 *
 * Used after upload to get permanent URL for storing in database
 */
export function getPublicUrl(fileName: string) {
  // URL encode the filename to handle special characters
  const encodedFileName = encodeURI(fileName);
  // Construct public URL using standard S3 URL pattern
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${encodedFileName}`;
}
