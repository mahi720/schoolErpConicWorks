import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const schoolUploadPath = path.join(
    process.cwd(),
    "uploads",
    "schoolLogo",
);

if (!fs.existsSync(schoolUploadPath)) {
    fs.mkdirSync(schoolUploadPath, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, schoolUploadPath);
    },

    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

        callback(null, uniqueName);
    },
});

const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
            new Error("Only JPG, JPEG, PNG and WEBP images are allowed"),
            false,
        );
    }

    callback(null, true);
};

export const uploadSchoolLogo = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});