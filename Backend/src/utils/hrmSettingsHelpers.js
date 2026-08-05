import fs from "fs";
import path from "path";

export const normalizeUpperText = (value) => value.trim().toUpperCase();

export const removeLocalFile = (filePath) => {
  if (!filePath) return;

  const normalizedPath = filePath.replace(/^\//, "");
  const absolutePath = path.resolve(normalizedPath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};
