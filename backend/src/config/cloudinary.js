import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async ({ buffer, folder }) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          image_url: result.secure_url,
          image_key: result.public_id,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

const deleteImageFromCloudinary = async (imageKey) => {
  if (!imageKey) return;

  await cloudinary.uploader.destroy(imageKey, {
    resource_type: "image",
  });
};

export { cloudinary, uploadImageToCloudinary, deleteImageFromCloudinary };
