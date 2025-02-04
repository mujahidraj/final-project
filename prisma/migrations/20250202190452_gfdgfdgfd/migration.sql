/*
  Warnings:

  - You are about to drop the column `studentId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_studentId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
