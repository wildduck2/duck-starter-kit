ALTER TABLE "otp_table" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX "otp_user_id_idx" ON "otp_table" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "otp_table" ADD CONSTRAINT "otp_table_user_id_unique" UNIQUE("user_id");