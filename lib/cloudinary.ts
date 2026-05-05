import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToPortfolio(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "portfolio",
          resource_type: "image",
          transformation: [{ width: 800, crop: "limit" }],
        },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });
}

export default cloudinary;
