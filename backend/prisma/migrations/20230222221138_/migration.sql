/*
  Warnings:

  - You are about to alter the column `clientname` on the `clientm` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `clientm` MODIFY `clientname` VARCHAR(191) NOT NULL;
