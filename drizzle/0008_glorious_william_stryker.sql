CREATE TABLE IF NOT EXISTS "users_to_articles" (
	"user_id" varchar NOT NULL,
	"article_id" uuid NOT NULL,
	CONSTRAINT "users_to_articles_user_id_article_id_pk" PRIMARY KEY("user_id","article_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_articles" ADD CONSTRAINT "users_to_articles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_articles" ADD CONSTRAINT "users_to_articles_article_id_source_id_fk" FOREIGN KEY ("article_id") REFERENCES "source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
