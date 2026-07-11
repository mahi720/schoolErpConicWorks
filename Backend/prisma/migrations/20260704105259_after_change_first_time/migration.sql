-- CreateTable
CREATE TABLE `schools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `schoolCode` VARCHAR(191) NOT NULL,
    `affiliationNumber` VARCHAR(191) NULL,
    `registrationNumber` VARCHAR(191) NULL,
    `contactPersonName` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `contactEmail` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `pinCode` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `plan` ENUM('BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE') NOT NULL DEFAULT 'BASIC',
    `planStartDate` DATETIME(3) NULL,
    `planEndDate` DATETIME(3) NULL,
    `maxStudents` INTEGER NULL,
    `maxUsers` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `schools_slug_key`(`slug`),
    UNIQUE INDEX `schools_schoolCode_key`(`schoolCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'ACCOUNTANT', 'LIBRARIAN', 'HR') NOT NULL DEFAULT 'SUPER_ADMIN',
    `schoolSlug` VARCHAR(50) NULL,
    `schoolCode` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `refreshToken` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_slug_key`(`slug`),
    UNIQUE INDEX `users_email_schoolSlug_key`(`email`, `schoolSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_slug_key`(`slug`),
    UNIQUE INDEX `sessions_schoolSlug_name_key`(`schoolSlug`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `boards_slug_key`(`slug`),
    UNIQUE INDEX `boards_schoolSlug_title_key`(`schoolSlug`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `classTitle` VARCHAR(191) NOT NULL,
    `classType` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `classes_slug_key`(`slug`),
    UNIQUE INDEX `classes_schoolSlug_sessionSlug_boardSlug_classTitle_key`(`schoolSlug`, `sessionSlug`, `boardSlug`, `classTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `sectionTitle` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sections_slug_key`(`slug`),
    UNIQUE INDEX `sections_schoolSlug_sessionSlug_boardSlug_sectionTitle_key`(`schoolSlug`, `sessionSlug`, `boardSlug`, `sectionTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `streams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `streamTitle` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `streams_slug_key`(`slug`),
    UNIQUE INDEX `streams_schoolSlug_sessionSlug_boardSlug_streamTitle_key`(`schoolSlug`, `sessionSlug`, `boardSlug`, `streamTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_section_stream_mappings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `classSlug` VARCHAR(50) NOT NULL,
    `sectionSlug` VARCHAR(50) NOT NULL,
    `streamSlug` VARCHAR(50) NULL,
    `classTeacherSlug` VARCHAR(50) NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `startTime` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `class_section_stream_mappings_slug_key`(`slug`),
    UNIQUE INDEX `class_section_stream_mappings_schoolSlug_sessionSlug_classSl_key`(`schoolSlug`, `sessionSlug`, `classSlug`, `sectionSlug`, `streamSlug`, `boardSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `subjectTitle` VARCHAR(191) NOT NULL,
    `subjectType` VARCHAR(191) NOT NULL,
    `subjectOrder` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subjects_slug_key`(`slug`),
    UNIQUE INDEX `subjects_schoolSlug_subjectTitle_key`(`schoolSlug`, `subjectTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `add_subject_to_classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `classSlug` VARCHAR(50) NOT NULL,
    `subjectSlug` VARCHAR(50) NOT NULL,
    `studyType` ENUM('THEORY', 'PRACTICAL', 'BOTH') NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `add_subject_to_classes_slug_key`(`slug`),
    UNIQUE INDEX `add_subject_to_classes_schoolSlug_boardSlug_sessionSlug_clas_key`(`schoolSlug`, `boardSlug`, `sessionSlug`, `classSlug`, `subjectSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject_topics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `classSlug` VARCHAR(50) NOT NULL,
    `subjectSlug` VARCHAR(50) NOT NULL,
    `topicTitle` VARCHAR(191) NOT NULL,
    `topicGroup` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subject_topics_slug_key`(`slug`),
    UNIQUE INDEX `subject_topics_schoolSlug_sessionSlug_boardSlug_classSlug_su_key`(`schoolSlug`, `sessionSlug`, `boardSlug`, `classSlug`, `subjectSlug`, `topicTitle`, `topicGroup`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject_marks_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `sessionSlug` VARCHAR(50) NOT NULL,
    `boardSlug` VARCHAR(50) NOT NULL,
    `classSlug` VARCHAR(50) NOT NULL,
    `subjectSlug` VARCHAR(50) NOT NULL,
    `extraSubjectName` VARCHAR(191) NOT NULL,
    `totalMarks` INTEGER NOT NULL,
    `passingMarks` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subject_marks_configs_slug_key`(`slug`),
    UNIQUE INDEX `subject_marks_configs_schoolSlug_sessionSlug_boardSlug_class_key`(`schoolSlug`, `sessionSlug`, `boardSlug`, `classSlug`, `subjectSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feeTypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `feeType` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `feeTypes_slug_key`(`slug`),
    UNIQUE INDEX `feeTypes_schoolSlug_feeType_key`(`schoolSlug`, `feeType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `remarks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `remarksTitle` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `remarks_slug_key`(`slug`),
    UNIQUE INDEX `remarks_schoolSlug_remarksTitle_key`(`schoolSlug`, `remarksTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_infos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(50) NOT NULL,
    `schoolSlug` VARCHAR(50) NOT NULL,
    `primaryClientId` VARCHAR(191) NULL,
    `primaryMerchantId` VARCHAR(191) NULL,
    `primarySecretKey` TEXT NULL,
    `otherClientId` VARCHAR(191) NULL,
    `otherMerchantId` VARCHAR(191) NULL,
    `otherSecretKey` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_infos_slug_key`(`slug`),
    UNIQUE INDEX `payment_infos_schoolSlug_key`(`schoolSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boards` ADD CONSTRAINT `boards_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `streams` ADD CONSTRAINT `streams_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `streams` ADD CONSTRAINT `streams_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `streams` ADD CONSTRAINT `streams_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_classSlug_fkey` FOREIGN KEY (`classSlug`) REFERENCES `classes`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_sectionSlug_fkey` FOREIGN KEY (`sectionSlug`) REFERENCES `sections`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_streamSlug_fkey` FOREIGN KEY (`streamSlug`) REFERENCES `streams`(`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_classTeacherSlug_fkey` FOREIGN KEY (`classTeacherSlug`) REFERENCES `users`(`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_section_stream_mappings` ADD CONSTRAINT `class_section_stream_mappings_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `add_subject_to_classes` ADD CONSTRAINT `add_subject_to_classes_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `add_subject_to_classes` ADD CONSTRAINT `add_subject_to_classes_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `add_subject_to_classes` ADD CONSTRAINT `add_subject_to_classes_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `add_subject_to_classes` ADD CONSTRAINT `add_subject_to_classes_classSlug_fkey` FOREIGN KEY (`classSlug`) REFERENCES `classes`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `add_subject_to_classes` ADD CONSTRAINT `add_subject_to_classes_subjectSlug_fkey` FOREIGN KEY (`subjectSlug`) REFERENCES `subjects`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_topics` ADD CONSTRAINT `subject_topics_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_topics` ADD CONSTRAINT `subject_topics_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_topics` ADD CONSTRAINT `subject_topics_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_topics` ADD CONSTRAINT `subject_topics_classSlug_fkey` FOREIGN KEY (`classSlug`) REFERENCES `classes`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_topics` ADD CONSTRAINT `subject_topics_subjectSlug_fkey` FOREIGN KEY (`subjectSlug`) REFERENCES `subjects`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_marks_configs` ADD CONSTRAINT `subject_marks_configs_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_marks_configs` ADD CONSTRAINT `subject_marks_configs_sessionSlug_fkey` FOREIGN KEY (`sessionSlug`) REFERENCES `sessions`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_marks_configs` ADD CONSTRAINT `subject_marks_configs_boardSlug_fkey` FOREIGN KEY (`boardSlug`) REFERENCES `boards`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_marks_configs` ADD CONSTRAINT `subject_marks_configs_classSlug_fkey` FOREIGN KEY (`classSlug`) REFERENCES `classes`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject_marks_configs` ADD CONSTRAINT `subject_marks_configs_subjectSlug_fkey` FOREIGN KEY (`subjectSlug`) REFERENCES `subjects`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feeTypes` ADD CONSTRAINT `feeTypes_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `remarks` ADD CONSTRAINT `remarks_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_infos` ADD CONSTRAINT `payment_infos_schoolSlug_fkey` FOREIGN KEY (`schoolSlug`) REFERENCES `schools`(`slug`) ON DELETE CASCADE ON UPDATE CASCADE;
