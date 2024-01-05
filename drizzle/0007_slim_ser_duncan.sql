ALTER TABLE "users_to_sources" RENAME COLUMN "sources_id" TO "source_id";--> statement-breakpoint
ALTER TABLE "users_to_sources" DROP CONSTRAINT "users_to_sources_sources_id_source_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_sources" DROP CONSTRAINT "users_to_sources_user_id_sources_id_pk";--> statement-breakpoint
ALTER TABLE "users_to_sources" ADD CONSTRAINT "users_to_sources_user_id_source_id_pk" PRIMARY KEY("user_id","source_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_sources" ADD CONSTRAINT "users_to_sources_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
