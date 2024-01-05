ALTER TABLE "users_to_articles" DROP CONSTRAINT "users_to_articles_article_id_source_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_articles" ADD CONSTRAINT "users_to_articles_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
