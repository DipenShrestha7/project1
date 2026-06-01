import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

[".env.migration", ".env", ".env.local", ".env.development"].forEach((file) => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false });
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const report = JSON.parse(
  fs.readFileSync("./scripts/cloudinary-migration-report.json", "utf8"),
);

const item = report.items.find((entry) => entry.status === "ready_exact");

if (!item) {
  console.log("No ready_exact image found.");
  process.exit(1);
}

console.log("Testing file:", item.local_file);

const result = await cloudinary.uploader.upload(item.local_file, {
  public_id: "project1/test/cloudinary-test",
  resource_type: "image",
  overwrite: true,
  invalidate: true,
});

console.log("Upload successful:");
console.log("URL:", result.secure_url);
console.log("Public ID:", result.public_id);

await cloudinary.uploader.destroy(result.public_id, {
  resource_type: "image",
});

console.log("Test image deleted from Cloudinary.");
