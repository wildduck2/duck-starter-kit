ALTER TABLE "message_table" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "message_table" ALTER COLUMN "type" SET NOT NULL;