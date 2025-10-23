import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectsCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

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

// export const configureBucketCORS = async () => {
//   const command = new PutBucketCorsCommand({
//     Bucket: s3Config.bucketName,
//     CORSConfiguration: {
//       CORSRules: [
//         {
//           AllowedHeaders: ["*"],
//           AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
//           AllowedOrigins: [
//             "http://localhost:5173",
//             "http://localhost:5000",
//             // "https://yourdomain.com" // Replace with your production domain
//           ],
//           ExposeHeaders: ["ETag"],
//           MaxAgeSeconds: 3000,
//         },
//       ],
//     },
//   });

//   try {
//     await s3Client.send(command);
//     console.log("S3 bucket CORS configured successfully");
//     return { success: true };
//   } catch (error) {
//     console.error("Error configuring S3 bucket CORS:", error);
//     return { success: false, error: error.message };
//   }
// };

// configureBucketCORS();

// Core AWS SDK operations
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

export const generatePresignedDownloadUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

export const uploadToS3 = async (key, buffer, contentType) => {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  });

  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return { success: false, error: error.message };
  }
};

export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return { success: false, error: error.message };
  }
};

export const deleteMultipleFromS3 = async (keys) => {
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
    console.error("Error deleting multiple from S3:", error);
    return { success: false, error: error.message };
  }
};

export const listS3Objects = async (params = {}) => {
  const command = new ListObjectsV2Command({
    Bucket: s3Config.bucketName,
    MaxKeys: 100,
    ...params,
  });

  try {
    const result = await s3Client.send(command);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    return { success: false, error: error.message };
  }
};

export const getS3ObjectMetadata = async (key) => {
  const command = new HeadObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  try {
    const result = await s3Client.send(command);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting S3 object metadata:", error);
    return { success: false, error: error.message };
  }
};

export const createS3Folder = async (folderPath) => {
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
    console.error("Error creating S3 folder:", error);
    return { success: false, error: error.message };
  }
};

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
