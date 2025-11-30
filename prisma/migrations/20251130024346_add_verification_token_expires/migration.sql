/*
  Warnings:

  - A unique constraint covering the columns `[verification_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reset_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verification_token_expires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_token_key" ON "users"("reset_token");
