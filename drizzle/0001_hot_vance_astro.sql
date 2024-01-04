CREATE TABLE IF NOT EXISTS "article" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255),
	"url" varchar(255) NOT NULL,
	"description" text,
	"hash" varchar(40) NOT NULL,
	"source" uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	CONSTRAINT "article_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255),
	"url" varchar(255) NOT NULL,
	"description" text,
	"hash" varchar(40) NOT NULL,
	CONSTRAINT "source_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "article_hash_idx" ON "article" ("hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "source_hash_idx" ON "source" ("hash");