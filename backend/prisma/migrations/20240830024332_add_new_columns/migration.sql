/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deskripsi` to the `Timkerja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ketua` to the `Timkerja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kegiatan` ADD COLUMN `deskripsi` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `subkegiatan` ADD COLUMN `deskripsi` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `timkerja` ADD COLUMN `deskripsi` VARCHAR(191) NOT NULL,
    ADD COLUMN `ketua` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tugas` ADD COLUMN `deskripsi` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_name_key` ON `User`(`name`);
