import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  DeleteObjectsCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  GetBucketPolicyCommand,
  GetPublicAccessBlockCommand,
  GetBucketAclCommand,
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

export const setupS3ForPublicAccess = async () => {
  try {
    console.log("=== COMPLETE S3 PUBLIC ACCESS SETUP ===");

    // 1. Disable Public Access Block (MOST IMPORTANT)
    const publicAccessResult = await checkAndFixPublicAccessBlock();
    if (!publicAccessResult.success) {
      throw new Error(
        `Public Access Block setup failed: ${publicAccessResult.error}`
      );
    }

    // 2. Set CORS
    const corsResult = await configureBucketCORS();
    if (!corsResult.success) {
      console.log("⚠️ CORS setup warning:", corsResult.error);
    }

    // 3. Set bucket policy
    const policyResult = await setBucketPublicReadPolicy();
    if (!policyResult.success) {
      throw new Error(`Bucket policy setup failed: ${policyResult.error}`);
    }

    // 4. Verify everything
    const debugResult = await debugBucketPermissions();

    console.log("✅ S3 Public Access Setup Complete!");
    return {
      success: true,
      publicAccessBlock: publicAccessResult,
      cors: corsResult,
      policy: policyResult,
      debug: debugResult,
    };
  } catch (error) {
    console.error("❌ S3 Setup Failed:", error);
    return { success: false, error: error.message };
  }
};

export const checkAndFixPublicAccessBlock = async () => {
  try {
    console.log("Checking Public Access Block settings...");

    const getCommand = new GetPublicAccessBlockCommand({
      Bucket: s3Config.bucketName,
    });

    const publicAccessSettings = await s3Client.send(getCommand);
    console.log("Current Public Access Block:", publicAccessSettings);

    // If any block public access settings are enabled, disable them
    if (publicAccessSettings.PublicAccessBlockConfiguration) {
      const {
        BlockPublicAcls,
        IgnorePublicAcls,
        BlockPublicPolicy,
        RestrictPublicBuckets,
      } = publicAccessSettings.PublicAccessBlockConfiguration;

      if (
        BlockPublicAcls ||
        IgnorePublicAcls ||
        BlockPublicPolicy ||
        RestrictPublicBuckets
      ) {
        console.log("⚠️ Public Access Block is enabled - disabling...");

        const putCommand = new PutPublicAccessBlockCommand({
          Bucket: s3Config.bucketName,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            BlockPublicPolicy: false,
            RestrictPublicBuckets: false,
          },
        });

        await s3Client.send(putCommand);
        console.log("✅ Public Access Block disabled successfully");
      } else {
        console.log("✅ Public Access Block is already disabled");
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error managing Public Access Block:", error.message);
    return { success: false, error: error.message };
  }
};

export const debugBucketPermissions = async () => {
  try {
    console.log("=== DEBUG BUCKET PERMISSIONS ===");

    // 1. Check bucket policy
    const policyCmd = new GetBucketPolicyCommand({
      Bucket: s3Config.bucketName,
    });
    const policyResponse = await s3Client.send(policyCmd);
    console.log("✅ Bucket Policy:", JSON.parse(policyResponse.Policy));

    // 2. Check bucket ACL
    const aclCmd = new GetBucketAclCommand({
      Bucket: s3Config.bucketName,
    });
    const aclResponse = await s3Client.send(aclCmd);
    console.log("✅ Bucket ACL:", aclResponse);

    // 3. Test public access
    const testUrl = `${s3Config.baseUrl}/`;
    console.log("✅ Test URL:", testUrl);

    return {
      success: true,
      policy: JSON.parse(policyResponse.Policy),
      acl: aclResponse,
    };
  } catch (error) {
    console.error("❌ Debug failed:", error.message);
    return { success: false, error: error.message };
  }
};

export const setBucketPublicReadPolicy = async () => {
  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${s3Config.bucketName}/*`,
      },
      {
        Sid: "PublicReadListBucket",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:ListBucket",
        Resource: `arn:aws:s3:::${s3Config.bucketName}`,
        Condition: {
          StringLike: {
            "s3:prefix": ["*"],
          },
        },
      },
    ],
  };

  const command = new PutBucketPolicyCommand({
    Bucket: s3Config.bucketName,
    Policy: JSON.stringify(bucketPolicy),
  });

  try {
    await s3Client.send(command);
    console.log("✅ Bucket public read policy set successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error setting bucket policy:", error.message);
    return { success: false, error: error.message };
  }
};

// Function to get current bucket policy (for verification)
export const getBucketPolicy = async () => {
  const command = new GetBucketPolicyCommand({
    Bucket: s3Config.bucketName,
  });

  try {
    const response = await s3Client.send(command);
    const policy = JSON.parse(response.Policy);
    console.log("Current bucket policy:", policy);
    return { success: true, policy };
  } catch (error) {
    console.error("Error getting bucket policy:", error.message);
    return { success: false, error: error.message };
  }
};

export const configureBucketCORS = async () => {
  const command = new PutBucketCorsCommand({
    Bucket: s3Config.bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          AllowedOrigins: [process.env.CLIENT_URL],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  });

  try {
    await s3Client.send(command);
    console.log("S3 bucket CORS configured successfully");
    return { success: true };
  } catch (error) {
    console.error("Error configuring S3 bucket CORS:", error.message);
    return { success: false, error: error.message };
  }
};

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
    // ACL: "public-read",
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
    // ACL: "public-read",
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
