CREATE TABLE `irl_participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`participant_name` text NOT NULL,
	`joined_at` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `irl_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `irl_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`skill` text NOT NULL,
	`level` text NOT NULL,
	`organizer_name` text NOT NULL,
	`max_participants` integer DEFAULT 4 NOT NULL,
	`message` text,
	`created_at` text NOT NULL
);
