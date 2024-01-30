-- CreateEnum
CREATE TYPE "PaymentTransactionStatusEnum" AS ENUM ('WAITING', 'INPROGRESS', 'CANCELED', 'APPROVED', 'REJECTED', 'REFUNDED', 'CHARGEBACK');

-- CreateEnum
CREATE TYPE "PaymentTransactionMethodEnum" AS ENUM ('CREDITCARD', 'DEBITCARD', 'PIX', 'BOLETO', 'TRANSFER', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentTransactionGatewayEnum" AS ENUM ('CASH', 'MERCADOPAGO');

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "transactionStatus" "PaymentTransactionStatusEnum" NOT NULL,
    "transactionMethod" "PaymentTransactionMethodEnum" NOT NULL,
    "transactionGateway" "PaymentTransactionGatewayEnum" NOT NULL,
    "transactionDatetime" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
