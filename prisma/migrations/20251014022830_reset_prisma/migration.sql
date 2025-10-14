-- CreateTable
CREATE TABLE "streak" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastDate" TIMESTAMP(3),

    CONSTRAINT "streak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "streak_userId_key" ON "streak"("userId");

-- AddForeignKey
ALTER TABLE "streak" ADD CONSTRAINT "streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
