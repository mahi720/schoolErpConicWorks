import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
    try {
        if (!filePath) return;

        const normalizedPath = filePath.replace(/\\/g, "/");
        const relativePath = normalizedPath.startsWith("/")
            ? normalizedPath.slice(1)
            : normalizedPath;

        const absolutePath = path.join(process.cwd(), relativePath);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    } catch (error) {
        console.error("File delete error:", error.message);
    }
};