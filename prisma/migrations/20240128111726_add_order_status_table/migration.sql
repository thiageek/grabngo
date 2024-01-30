/*
  Warnings:

  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('CREATED', 'INQUEUE', 'EXPIRED', 'INPROGRESS', 'CANCELED', 'READY', 'WAITINGPICKUP', 'DISCARDED', 'DELIVERED');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ADD COLUMN     "statusId" TEXT;

-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "name" "StatusEnum" NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_name_key" ON "status"("name");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
