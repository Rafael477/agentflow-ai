ALTER TABLE "AgentTraining" ADD COLUMN "fileName" TEXT;
ALTER TABLE "AgentTraining" ADD COLUMN "fileMimeType" TEXT;
ALTER TABLE "AgentTraining" ADD COLUMN "fileSizeBytes" INTEGER;
ALTER TABLE "AgentTraining" ADD COLUMN "fileUrl" TEXT;
ALTER TABLE "AgentTraining" ADD COLUMN "uploadedAt" TIMESTAMP(3);
