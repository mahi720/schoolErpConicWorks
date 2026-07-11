import crypto from "crypto";
import prisma from "../src/config/prisma.js";

const seedPaymentInfo = async () => {
    const school = await prisma.school.findUnique({
        where: {
            schoolCode: "SCH-0001",
        },
        select: {
            slug: true,
            schoolName: true,
        },
    });

    if (!school) {
        throw new Error(
            "School SCH-0001 not found. Seed school first",
        );
    }

    const paymentInfo =
        await prisma.paymentInfo.upsert({
            where: {
                schoolSlug: school.slug,
            },

            update: {},

            create: {
                slug: crypto.randomUUID(),
                schoolSlug: school.slug,

                primaryClientId: null,
                primaryMerchantId: null,
                primarySecretKey: null,

                otherClientId: null,
                otherMerchantId: null,
                otherSecretKey: null,

                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });

    console.log(
        `✅ Payment info seeded for ${school.schoolName}`,
    );

    return paymentInfo;
};

seedPaymentInfo()
    .catch((error) => {
        console.error(
            "❌ Payment seed failed:",
            error,
        );

        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });