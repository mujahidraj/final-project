-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "present_address" TEXT NOT NULL,
    "permanent_address" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);
