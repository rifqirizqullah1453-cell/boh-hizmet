CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255) NOT NULL,
	`name` varchar(255),
	`phone` varchar(20),
	`role` enum('customer','worker','admin') NOT NULL DEFAULT 'customer',
	`rating` decimal(3,1) DEFAULT '5.0',
	`totalRatings` int DEFAULT 0,
	`isOnline` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`customerId` bigint unsigned NOT NULL,
	`workerId` bigint unsigned,
	`serviceType` enum('delivery','shopping','cleaning','moving') NOT NULL,
	`status` enum('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
	`pickupAddress` text NOT NULL,
	`pickupLat` decimal(10,7) NOT NULL,
	`pickupLng` decimal(10,7) NOT NULL,
	`destinationAddress` text NOT NULL,
	`destinationLat` decimal(10,7) NOT NULL,
	`destinationLng` decimal(10,7) NOT NULL,
	`price` int NOT NULL,
	`notes` text,
	`cancelReason` text,
	`cancelledBy` varchar(20),
	`acceptedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_customerId_users_id_fk` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_workerId_users_id_fk` FOREIGN KEY (`workerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;