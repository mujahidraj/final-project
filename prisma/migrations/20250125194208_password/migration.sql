/*
  Warnings:

  - Added the required column `password` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "password" TEXT NOT NULL;
