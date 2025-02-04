-- CreateTable
CREATE TABLE "studentNotification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studentNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "studentNotification" ADD CONSTRAINT "studentNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
