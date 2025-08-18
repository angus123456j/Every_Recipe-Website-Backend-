const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { randomUUID } = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const s3Uploader = [
  upload.single("imageURL"),
  async (req, res, next) => {
    console.log("S3 Uploader - Request body:", req.body);
    console.log("S3 Uploader - File:", req.file);
    
    if (!req.file) {
      console.log("S3 Uploader - No file uploaded, proceeding without image");
      req.imageURL = null;
      return next();
    }

    const file = req.file;
    const fileName = `${Date.now()}-${randomUUID()}-${file.originalname}`;
    console.log("S3 Uploader - File name:", fileName);
    
    try {
      const parallelUpload = new Upload({
        client: s3,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      await parallelUpload.done();
      console.log("S3 Uploader - Upload successful");

      const imageURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      console.log("S3 Uploader - Image URL:", imageURL);

      req.imageURL = imageURL;
      next();
    } catch (err) {
      console.error("S3 Upload Error:", err);
      console.error("S3 Upload Error Details:", {
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME,
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
      });
      // Don't fail the entire request, just set imageURL to null
      req.imageURL = null;
      next();
    }
  },
];

module.exports = s3Uploader;
