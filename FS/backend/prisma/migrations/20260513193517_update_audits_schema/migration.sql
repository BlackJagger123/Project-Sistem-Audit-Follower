-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "RiskLabel" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "audits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ig_username" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'pending',
    "total_sample" INTEGER,
    "bot_percentage" DECIMAL(5,2),
    "real_percentage" DECIMAL(5,2),
    "risk_label" "RiskLabel",
    "recommendation" TEXT,
    "raw_ai_response" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audits_user_id_idx" ON "audits"("user_id");

-- CreateIndex
CREATE INDEX "audits_created_at_idx" ON "audits"("created_at" DESC);

-- CreateIndex
CREATE INDEX "audits_user_id_created_at_idx" ON "audits"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "audits" ADD CONSTRAINT "audits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
