ALTER TABLE "Case" ADD COLUMN "version" DECIMAL(10,0) NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Case_id_version_key" ON "Case"("id", "version");
