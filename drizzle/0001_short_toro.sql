CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`odoo_post_id` int,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`meta_description` text,
	`keywords` text,
	`ai_writer` enum('gemini','chatgpt','claude') NOT NULL,
	`seo_score` int,
	`readability_score` int,
	`engagement_score` int,
	`total_score` int,
	`status` enum('draft','published','scheduled','failed') NOT NULL DEFAULT 'draft',
	`published_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`views` int DEFAULT 0,
	`engagement` int DEFAULT 0,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `configuration` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `configuration_id` PRIMARY KEY(`id`),
	CONSTRAINT `configuration_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `publication_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`status` enum('success','failed','retrying') NOT NULL,
	`error_message` text,
	`published_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `publication_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topic_name` text NOT NULL,
	`keywords` text NOT NULL,
	`seo_difficulty` int,
	`related_products` text,
	`outline` text,
	`status` enum('pending','used','archived') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`used_at` timestamp,
	CONSTRAINT `topics_id` PRIMARY KEY(`id`)
);
