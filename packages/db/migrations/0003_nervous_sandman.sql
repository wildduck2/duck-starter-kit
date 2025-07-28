CREATE TABLE "feedback_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "llm_models_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"provider" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"context_limit" integer NOT NULL,
	"token_price" integer NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"user_id" uuid NOT NULL,
	"chat_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_users_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permission_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_table_email_unique" UNIQUE("email"),
	CONSTRAINT "user_table_user_name_unique" UNIQUE("user_name")
);
--> statement-breakpoint
CREATE TABLE "wishlist_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (0) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" RENAME TO "chat_table";--> statement-breakpoint
ALTER TABLE "chat_table" RENAME COLUMN "username" TO "name";--> statement-breakpoint
ALTER TABLE "chat_table" RENAME COLUMN "email" TO "organization_id";--> statement-breakpoint
DROP INDEX "users_username_idx";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
ALTER TABLE "chat_table" ALTER COLUMN "created_at" SET DATA TYPE timestamp (0) with time zone;--> statement-breakpoint
ALTER TABLE "chat_table" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (0) with time zone;--> statement-breakpoint
ALTER TABLE "feedback_table" ADD CONSTRAINT "feedback_table_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_table" ADD CONSTRAINT "feedback_table_message_id_message_table_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_table" ADD CONSTRAINT "message_table_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_table" ADD CONSTRAINT "message_table_chat_id_chat_table_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_table" ADD CONSTRAINT "message_table_model_id_llm_models_table_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."llm_models_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_table" ADD CONSTRAINT "organization_table_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_users_table" ADD CONSTRAINT "organization_users_table_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_users_table" ADD CONSTRAINT "organization_users_table_role_id_role_table_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_users_table" ADD CONSTRAINT "organization_users_table_organization_id_organization_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission_table" ADD CONSTRAINT "role_permission_table_role_id_role_table_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission_table" ADD CONSTRAINT "role_permission_table_permission_id_permission_table_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_table" ADD CONSTRAINT "role_table_organization_id_organization_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_user_id_idx" ON "feedback_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "feedback_message_id_idx" ON "feedback_table" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_user_id_idx" ON "message_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_chat_id_idx" ON "message_table" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "message_model_id_idx" ON "message_table" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "organization_user_id_idx" ON "organization_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "org_users_user_id_idx" ON "organization_users_table" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "org_users_org_id_idx" ON "organization_users_table" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "org_users_role_id_idx" ON "organization_users_table" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_perm_role_id_idx" ON "role_permission_table" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_perm_permission_id_idx" ON "role_permission_table" USING btree ("permission_id");--> statement-breakpoint
CREATE INDEX "role_organization_id_idx" ON "role_table" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user_table" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_user_name_idx" ON "user_table" USING btree ("user_name");--> statement-breakpoint
ALTER TABLE "chat_table" ADD CONSTRAINT "chat_table_organization_id_organization_table_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_organization_id_idx" ON "chat_table" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "chat_table" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "chat_table" ADD CONSTRAINT "chat_table_name_unique" UNIQUE("name");