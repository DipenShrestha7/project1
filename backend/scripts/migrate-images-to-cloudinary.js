import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";

[".env.migration", ".env", ".env.local", ".env.development"].forEach((file) => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false });
  }
});

const apply = process.argv.includes("--apply");
const uploadsRoot = path.resolve(process.cwd(), "uploads");
const reportPath = path.resolve(
  process.cwd(),
  "scripts",
  "cloudinary-migration-report.json",
);

const tables = [
  {
    table: "images",
    idColumn: "image_id",
    urlColumn: "image_url",
    keyColumn: "image_key",
  },
  {
    table: "users",
    idColumn: "user_id",
    urlColumn: "profile_image",
    keyColumn: "profile_image_key",
  },
  {
    table: "contact_details",
    idColumn: "id",
    urlColumn: "image",
    keyColumn: "image_key",
  },
];

const requiredEnv = [
  "DATABASE_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error("Missing environment variables:", missingEnv.join(", "));
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const databaseHost = new URL(process.env.DATABASE_URL).hostname;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    databaseHost.includes("localhost") || databaseHost.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

const normalizeSlashes = (value) => value.replace(/\\/g, "/");

const isCloudinaryUrl = (value) => {
  return value.includes("res.cloudinary.com");
};

const shouldSkipExternalUrl = (value) => {
  if (!value.startsWith("http://") && !value.startsWith("https://"))
    return false;

  try {
    const url = new URL(value);
    if (url.pathname.includes("/uploads/")) return false;
    return true;
  } catch {
    return true;
  }
};

const toRelativeUploadPath = (value) => {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;
  if (trimmed.startsWith("data:")) return null;
  if (trimmed.startsWith("blob:")) return null;
  if (isCloudinaryUrl(trimmed)) return null;
  if (shouldSkipExternalUrl(trimmed)) return null;

  let pathname = trimmed;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const url = new URL(trimmed);
    pathname = url.pathname;
  }

  pathname = decodeURIComponent(pathname);
  pathname = normalizeSlashes(pathname);

  const uploadsIndex = pathname.indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    return pathname.slice(uploadsIndex + 1);
  }

  if (pathname.startsWith("/uploads/")) {
    return pathname.slice(1);
  }

  if (pathname.startsWith("uploads/")) {
    return pathname;
  }

  if (pathname.startsWith("/")) {
    return `uploads${pathname}`;
  }

  return `uploads/${pathname}`;
};

const listFilesByName = (dir, fileName, results = []) => {
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      listFilesByName(fullPath, fileName, results);
    } else if (entry.name === fileName) {
      results.push(fullPath);
    }
  }

  return results;
};

const findLocalFile = (relativePath) => {
  const safeRelativePath = normalizeSlashes(relativePath).replace(
    /^uploads\//,
    "",
  );
  const exactPath = path.resolve(uploadsRoot, safeRelativePath);

  if (!exactPath.startsWith(uploadsRoot)) {
    return {
      status: "invalid_path",
      filePath: null,
      matches: [],
    };
  }

  if (fs.existsSync(exactPath)) {
    return {
      status: "found_exact",
      filePath: exactPath,
      matches: [exactPath],
    };
  }

  const fileName = path.basename(safeRelativePath);
  const matches = listFilesByName(uploadsRoot, fileName);

  if (matches.length === 1) {
    return {
      status: "found_by_filename",
      filePath: matches[0],
      matches,
    };
  }

  if (matches.length > 1) {
    return {
      status: "ambiguous",
      filePath: null,
      matches,
    };
  }

  return {
    status: "missing",
    filePath: null,
    matches: [],
  };
};

const buildPublicId = (filePath) => {
  const relativePath = normalizeSlashes(path.relative(uploadsRoot, filePath));
  const withoutExtension = relativePath.replace(/\.[^.]+$/, "");
  return `project1/${withoutExtension}`;
};

const uploadToCloudinary = async (filePath) => {
  const publicId = buildPublicId(filePath);

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
    invalidate: true,
  });

  return {
    image_url: result.secure_url,
    image_key: result.public_id,
  };
};

const quote = (value) => `"${value}"`;

const migrateTable = async (tableInfo, report) => {
  const { table, idColumn, urlColumn, keyColumn } = tableInfo;

  const selectSql = `
    SELECT ${quote(idColumn)} AS id, ${quote(urlColumn)} AS image_value, ${quote(keyColumn)} AS image_key
    FROM ${quote(table)}
    WHERE ${quote(urlColumn)} IS NOT NULL
    AND ${quote(urlColumn)} <> ''
  `;

  const rows = await pool.query(selectSql);

  for (const row of rows.rows) {
    const item = {
      table,
      id: row.id,
      old_value: row.image_value,
      old_key: row.image_key,
      relative_path: null,
      local_file: null,
      new_url: null,
      new_key: null,
      status: null,
      matches: [],
    };

    if (isCloudinaryUrl(row.image_value)) {
      item.status = "already_cloudinary";
      report.items.push(item);
      continue;
    }

    if (shouldSkipExternalUrl(row.image_value)) {
      item.status = "skipped_external";
      report.items.push(item);
      continue;
    }

    const relativePath = toRelativeUploadPath(row.image_value);
    item.relative_path = relativePath;

    if (!relativePath) {
      item.status = "skipped_invalid";
      report.items.push(item);
      continue;
    }

    const fileResult = findLocalFile(relativePath);
    item.local_file = fileResult.filePath;
    item.matches = fileResult.matches;

    if (!fileResult.filePath) {
      item.status = fileResult.status;
      report.items.push(item);
      continue;
    }

    if (!apply) {
      item.status =
        fileResult.status === "found_exact"
          ? "ready_exact"
          : "ready_by_filename";
      item.new_key = buildPublicId(fileResult.filePath);
      report.items.push(item);
      continue;
    }

    const uploaded = await uploadToCloudinary(fileResult.filePath);

    const updateSql = `
      UPDATE ${quote(table)}
      SET ${quote(urlColumn)} = $1, ${quote(keyColumn)} = $2
      WHERE ${quote(idColumn)} = $3
    `;

    await pool.query(updateSql, [
      uploaded.image_url,
      uploaded.image_key,
      row.id,
    ]);

    item.status = "migrated";
    item.new_url = uploaded.image_url;
    item.new_key = uploaded.image_key;
    report.items.push(item);
  }
};

const summarize = (items) => {
  return items.reduce((summary, item) => {
    summary[item.status] = (summary[item.status] || 0) + 1;
    return summary;
  }, {});
};

const main = async () => {
  const report = {
    mode: apply ? "apply" : "dry-run",
    database_host: databaseHost,
    uploads_root: uploadsRoot,
    items: [],
  };

  console.log("Mode:", report.mode);
  console.log("Database host:", databaseHost);
  console.log("Uploads folder:", uploadsRoot);

  if (!fs.existsSync(uploadsRoot)) {
    console.error("Uploads folder not found:", uploadsRoot);
    process.exit(1);
  }

  for (const tableInfo of tables) {
    await migrateTable(tableInfo, report);
  }

  report.summary = summarize(report.items);

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("Summary:", report.summary);
  console.log("Report saved to:", reportPath);

  await pool.end();
};

main().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
