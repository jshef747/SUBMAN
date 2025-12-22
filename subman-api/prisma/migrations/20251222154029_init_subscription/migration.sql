-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "payCycle" TEXT NOT NULL,
    "renewalDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
