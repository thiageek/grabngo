/*
  Warnings:

  - You are about to drop the `ProductCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductCategories" DROP CONSTRAINT "ProductCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategories" DROP CONSTRAINT "ProductCategories_productId_fkey";

-- DropTable
DROP TABLE "ProductCategories";

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
