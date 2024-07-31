CREATE TABLE `donations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`donorId` integer NOT NULL,
	`itemCounts` text NOT NULL,
	`totalCount` integer NOT NULL,
	`notes` text,
	`receivedBy` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`donorId`) REFERENCES `donors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `donors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text,
	`lastName` text,
	`businessName` text,
	`email` text,
	`phone` text,
	`isIndividual` integer NOT NULL,
	`isBusiness` integer NOT NULL,
	`address1` text,
	`city` text,
	`state` text,
	`zip` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `receivables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
