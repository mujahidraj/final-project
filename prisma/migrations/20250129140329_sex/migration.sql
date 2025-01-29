/*
  Warnings:

  - Changed the type of `sex` on the `Teacher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sex` on the `students` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "sex",
ADD COLUMN     "sex" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "sex",
ADD COLUMN     "sex" TEXT NOT NULL;

-- DropEnum
DROP TYPE "UserSex";
