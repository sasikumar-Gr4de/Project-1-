import {S3Client , GetObjectCommand, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import dotenv from 'dotenv'

dotenv.config()

// S3 Client Configuration
export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    maxAttempts: 3
});

export const s3Config = {
    bucketName: process.env.AWS_S3_BUCKET_NAME | 'gr4de-platform',
    region: process.env.AWS_REGION | 'us-east-1',
    baseUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
};

// Generate pre-signed URL for upload
export const generatePresignedUploadUrl = async (key, contentType, expiresIn = 3600) => {
  const command = new PutObjectCommand({
    Bucket: s3Config.bucket,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read'
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

// Generate pre-signed URL for download
export const generatePresignedDownloadUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: s3Config.bucket,
    Key: key
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
};

// Delete object from S3
export const deleteObjectFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: s3Config.bucket,
    Key: key
  });

  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error deleting object from S3:', error);
    return { success: false, error: error.message };
  }
};
