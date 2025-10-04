CREATE TABLE `admin_activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`timestamp` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_name` text NOT NULL,
	`description` text,
	`demo_url` text,
	`is_locked` integer DEFAULT true,
	`vote_count` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `system_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`voting_enabled` integer DEFAULT false,
	`emergency_lockdown` integer DEFAULT false,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer,
	`voter_identifier` text NOT NULL,
	`voted_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
