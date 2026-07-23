import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDirectory =
    "uploads/studentsProfilePhoto";

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (
        req,
        file,
        callback,
    ) => {
        callback(null, uploadDirectory);
    },

    filename: (
        req,
        file,
        callback,
    ) => {
        const extension =
            path.extname(
                file.originalname,
            );

        const filename = `student-${Date.now()}-${crypto
            .randomUUID()
            .slice(0, 8)}${extension}`;

        callback(null, filename);
    },
});

const fileFilter = (
    req,
    file,
    callback,
) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (
        allowedTypes.includes(file.mimetype)
    ) {
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

export const studentImageUpload =
    multer({
        storage,
        fileFilter,

        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    });