ALTER TABLE "message_table" ALTER COLUMN "type" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "message_table" ALTER COLUMN "type" DROP NOT NULL;