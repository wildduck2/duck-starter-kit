ALTER TABLE "otp_table" DROP CONSTRAINT "otp_table_user_id_unique";--> statement-breakpoint
DROP INDEX "otp_user_id_idx";--> statement-breakpoint
ALTER TABLE "otp_table" DROP COLUMN "user_id";