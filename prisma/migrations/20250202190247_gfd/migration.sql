/*
  Warnings:

  - You are about to drop the column `studentId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_studentId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "studentId";
