-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "techerName" TEXT,
    "courseName" TEXT,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);
