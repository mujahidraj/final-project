/*
  Warnings:

  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "report";

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "teacherName" TEXT,
    "courseName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_studentId_idx" ON "Report"("studentId");
