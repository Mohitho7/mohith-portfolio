-- AlterTable
ALTER TABLE "Hero" ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "scrollCtaText" TEXT NOT NULL DEFAULT 'Scroll';

-- Drop the old column from the previous migration if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Hero' AND column_name = 'availableForProjects') THEN
        ALTER TABLE "Hero" DROP COLUMN "availableForProjects";
    END IF;
END $$;
