import AWS from "aws-sdk";

// Configure AWS
AWS.config.update({
  region: import.meta.env.VITE_AWS_REGION,
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  params: { Bucket: import.meta.env.VITE_AWS_S3_BUCKET },
  region: import.meta.env.VITE_AWS_REGION,
});

export const awsService = {
  // Upload file to S3
  async uploadFile(file, folder = "") {
    try {
      const key = `${folder}${Date.now()}-${file.name}`;

      const params = {
        Key: key,
        Body: file,
        ContentType: file.type,
        ACL: "public-read",
      };

      const result = await s3.upload(params).promise();

      return {
        success: true,
        url: result.Location,
        key: result.Key,
        message: "File uploaded successfully",
      };
    } catch (error) {
      console.error("AWS Upload Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Download file from S3
  async downloadFile(key, fileName) {
    try {
      const params = {
        Key: key,
      };

      const result = await s3.getObject(params).promise();

      // Create download link
      const blob = new Blob([result.Body], { type: result.ContentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: "File downloaded successfully",
      };
    } catch (error) {
      console.error("AWS Download Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete file from S3
  async deleteFile(key) {
    try {
      const params = {
        Key: key,
      };

      await s3.deleteObject(params).promise();

      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      console.error("AWS Delete Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // List files in S3 bucket
  async listFiles(prefix = "") {
    try {
      const params = {
        Prefix: prefix,
      };

      const result = await s3.listObjectsV2(params).promise();

      return {
        success: true,
        files: result.Contents.map((item) => ({
          key: item.Key,
          name: item.Key.split("/").pop(),
          size: item.Size,
          lastModified: item.LastModified,
          url: `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
            import.meta.env.VITE_AWS_REGION
          }.amazonaws.com/${item.Key}`,
        })),
      };
    } catch (error) {
      console.error("AWS List Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default awsService;
