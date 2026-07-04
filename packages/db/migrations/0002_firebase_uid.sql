ALTER TABLE `users` DROP INDEX `users_unionId_unique`;--> statement-breakpoint
ALTER TABLE `users` CHANGE `unionId` `firebaseUid` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD UNIQUE `users_firebaseUid_unique`(`firebaseUid`);
