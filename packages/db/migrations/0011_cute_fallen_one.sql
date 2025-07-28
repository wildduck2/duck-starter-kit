CREATE TYPE "public"."message_type" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
ALTER TABLE "message_table" ALTER COLUMN "type" SET DATA TYPE message_type;