/*
  Warnings:

  - Made the column `statusId` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `name` on the `status` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatusNameEnum" AS ENUM ('CREATED', 'INQUEUE', 'EXPIRED', 'INPROGRESS', 'CANCELED', 'READY', 'WAITINGPICKUP', 'DISCARDED', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_statusId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "statusId" SET NOT NULL;

-- AlterTable
ALTER TABLE "status" DROP COLUMN "name",
ADD COLUMN     "name" "OrderStatusNameEnum" NOT NULL;

-- DropEnum
DROP TYPE "StatusEnum";

-- CreateIndex
CREATE UNIQUE INDEX "status_name_key" ON "status"("name");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
