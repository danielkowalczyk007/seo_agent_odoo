CREATE TABLE `social_media_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blog_post_id` int NOT NULL,
	`platform` enum('linkedin','facebook','twitter','instagram') NOT NULL,
	`content` text NOT NULL,
	`hashtags` text,
	`odoo_post_id` int,
	`status` enum('draft','published','failed') NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_media_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `topics` ADD `category` enum('kompensacja','svg') NOT NULL;