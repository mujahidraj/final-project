/*
  Warnings:

  - Added the required column `courseId` to the `assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignment" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
