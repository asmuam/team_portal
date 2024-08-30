/*
  Warnings:

  - You are about to drop the column `ketua` on the `timkerja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `timkerja` DROP COLUMN `ketua`;

-- AlterTable
ALTER TABLE `user` MODIFY `refresh_token` VARCHAR(255) NULL;
