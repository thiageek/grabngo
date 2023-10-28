/*
  Warnings:

  - You are about to drop the column `clientId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_clientId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "clientId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
