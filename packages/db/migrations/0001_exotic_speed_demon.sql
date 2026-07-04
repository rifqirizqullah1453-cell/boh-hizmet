CREATE TABLE `ratings` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`orderId` varchar(36) NOT NULL,
	`customerId` bigint unsigned NOT NULL,
	`workerId` bigint unsigned NOT NULL,
	`stars` tinyint NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`),
	CONSTRAINT `ratings_orderId_unique` UNIQUE(`orderId`)
);
--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_customerId_users_id_fk` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_workerId_users_id_fk` FOREIGN KEY (`workerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;