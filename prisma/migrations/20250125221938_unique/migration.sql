/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[password]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "students_username_key" ON "students"("username");

-- CreateIndex
CREATE UNIQUE INDEX "students_password_key" ON "students"("password");
