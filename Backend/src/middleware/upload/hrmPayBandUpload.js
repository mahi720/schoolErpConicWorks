import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";

const uploadDirectory = "uploads/hrm/payBandsSignatures";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);

    const filename = `pay-band-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 8)}${extension}`;

    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed",
      ),
      false,
    );
  }
};

export const hrmPayBandUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});