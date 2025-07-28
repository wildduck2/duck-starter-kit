ALTER TABLE "message_table" RENAME COLUMN "user_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "message_table" DROP CONSTRAINT "message_table_user_id_user_table_id_fk";
--> statement-breakpoint
DROP INDEX "message_user_id_idx";--> statement-breakpoint
ALTER TABLE "message_table" ADD CONSTRAINT "message_table_organization_id_user_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "message_user_id_idx" ON "message_table" USING btree ("organization_id");