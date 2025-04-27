-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'ANALYST') NOT NULL DEFAULT 'ANALYST',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agency` (
    `id` VARCHAR(191) NOT NULL,
    `fantasyName` VARCHAR(191) NOT NULL,
    `legalName` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `stateRegistration` VARCHAR(191) NOT NULL,
    `foundingDate` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agency_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
