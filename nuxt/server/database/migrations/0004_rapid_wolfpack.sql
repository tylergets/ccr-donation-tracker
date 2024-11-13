CREATE TABLE `equipmentCheckOuts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`itemCounts` text NOT NULL,
	`volunteerId` integer NOT NULL,
	`approvedBy` text,
	`approvedAt` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`volunteerId`) REFERENCES `volunteers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `volunteers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
