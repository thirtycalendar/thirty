ALTER TABLE `accounts` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `verifications` DROP COLUMN `deleted_at`;