CREATE TABLE IF NOT EXISTS "users_to_sources" (
	"user_id" integer NOT NULL,
	"sources_id" integer NOT NULL,
	CONSTRAINT "users_to_sources_user_id_sources_id_pk" PRIMARY KEY("user_id","sources_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_sources" ADD CONSTRAINT "users_to_sources_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_sources" ADD CONSTRAINT "users_to_sources_sources_id_source_id_fk" FOREIGN KEY ("sources_id") REFERENCES "source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
