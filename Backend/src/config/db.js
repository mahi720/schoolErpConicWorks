import prisma from "./prisma.js";

const connectDB = async () => {
    try {
        await prisma.$connect();

        console.log("✅ MySQL Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);

        process.exit(1);
    }
};

export default connectDB;