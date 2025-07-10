ALTER TABLE "birthdays" RENAME COLUMN "colorId" TO "color_id";--> statement-breakpoint
ALTER TABLE "calendars" RENAME COLUMN "colorId" TO "color_id";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "colorId" TO "color_id";--> statement-breakpoint
ALTER TABLE "tasks" RENAME COLUMN "colorId" TO "color_id";--> statement-breakpoint
ALTER TABLE "birthdays" ADD COLUMN "dob" date NOT NULL;