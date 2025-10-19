import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

// S3 Client Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3,
});

export const s3Config = {
  bucketName: process.env.AWS_S3_BUCKET_NAME || "gr4de-platform",
  region: process.env.AWS_REGION || "us-east-1",
  baseUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
};

// Generate pre-signed URL for upload
export const generatePresignedUploadUrl = async (
  key,
  contentType,
  expiresIn = 3600
) => {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

// Generate pre-signed URL for download
export const generatePresignedDownloadUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

// Delete object from S3
export const deleteObjectFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    return { success: false, error: error.message };
  }
};

// Delete multiple objects from S3
export const deleteObjectsFromS3 = async (keys) => {
  const command = new DeleteObjectsCommand({
    Bucket: s3Config.bucketName,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  });

  try {
    const result = await s3Client.send(command);
    return {
      success: true,
      deleted: result.Deleted || [],
      errors: result.Errors || [],
    };
  } catch (error) {
    console.error("Error deleting objects from S3:", error);
    return { success: false, error: error.message };
  }
};

// List objects in S3 bucket
export const listObjectsInS3 = async (params = {}) => {
  const command = new ListObjectsV2Command({
    Bucket: s3Config.bucketName,
    MaxKeys: 100,
    ...params,
  });

  try {
    const result = await s3Client.send(command);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error listing objects from S3:", error);
    return { success: false, error: error.message };
  }
};

// Get object metadata
export const getObjectMetadata = async (key) => {
  const command = new HeadObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  try {
    const result = await s3Client.send(command);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting object metadata from S3:", error);
    return { success: false, error: error.message };
  }
};

// Create folder in S3
export const createFolderInS3 = async (folderPath) => {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: folderPath.endsWith("/") ? folderPath : `${folderPath}/`,
    Body: "",
    ContentType: "application/x-directory",
  });

  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error creating folder in S3:", error);
    return { success: false, error: error.message };
  }
};

// Check S3 connection
export const testS3Connection = async () => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: s3Config.bucketName,
      MaxKeys: 1,
    });

    await s3Client.send(command);
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};
