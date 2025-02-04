-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
