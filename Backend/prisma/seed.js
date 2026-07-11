import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateSlug } from "../src/utils/generateSlug.js";

const prisma = new PrismaClient();

async function main() {
    const school = await prisma.school.upsert({
        where: { schoolCode: "SCH-0001" },
        update: {
            schoolName: "Demo School",
            contactPersonName: "Admin",
            contactNumber: "9999999999",
            contactEmail: "admin@school.com",
            addressLine1: "Demo Address",
            city: "Bhilai",
            district: "Durg",
            state: "Chhattisgarh",
            pinCode: "490001",
            isActive: true,
        },
        create: {
            slug: generateSlug("SCH"),
            schoolName: "Demo School",
            schoolCode: "SCH-0001",
            contactPersonName: "Admin",
            contactNumber: "9999999999",
            contactEmail: "admin@school.com",
            addressLine1: "Demo Address",
            city: "Bhilai",
            district: "Durg",
            state: "Chhattisgarh",
            pinCode: "490001",
            isActive: true,
            maxStudents: 1000,
            maxUsers: 50,
        },
    });

    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.user.upsert({
        where: {
            email_schoolSlug: {
                email: "superadmin@098.com",
                schoolSlug: school.slug,
            },
        },
        update: {
            name: "Super Admin",
            role: "SUPER_ADMIN",
            schoolSlug: school.slug,
            schoolCode: school.schoolCode,
            isActive: true,
        },
        create: {
            slug: generateSlug("USR"),
            name: "Super Admin",
            email: "superadmin@098.com",
            password: hashedPassword,
            role: "SUPER_ADMIN",
            schoolSlug: school.slug,
            schoolCode: school.schoolCode,
            isActive: true,
        },
    });

    console.log("✅ School and Super Admin Seeded");
}

main()
    .catch((error) => {
        console.error("❌ Seed Error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });