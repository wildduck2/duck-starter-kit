CREATE TABLE "otp_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"otp" varchar(255) NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp (0) with time zone NOT NULL,
	CONSTRAINT "otp_table_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE INDEX "otp_user_id_idx" ON "otp_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "otp_expires_at_idx" ON "otp_table" USING btree ("expires_at");