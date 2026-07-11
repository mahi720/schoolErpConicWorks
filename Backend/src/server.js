// import dotenv from "dotenv";
// dotenv.config();

import "dotenv/config";

import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("✅ MySQL Connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // app.listen(PORT, "0.0.0.0", () => {
        //     console.log(`Server running on http://localhost:${PORT}`);
        // });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        process.exit(1);
    }
};

startServer();