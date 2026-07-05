import { sql } from "drizzle-orm";
import type { Database } from "@boh/db";

/**
 * Creates core tables (users, orders, ratings) if they don't exist.
 * Idempotent — safe to call on every server startup.
 * Must run before ensureCleaningSchema / ensureMovingSchema since those
 * reference the orders table via foreign keys in cleaning_orders.
 */
export async function ensureCoreSchema(db: Database): Promise<void> {
  const DDL: string[] = [
    `CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\`           bigint unsigned NOT NULL AUTO_INCREMENT,
      \`firebaseUid\`  varchar(128)    NOT NULL,
      \`name\`         varchar(255),
      \`phone\`        varchar(20),
      \`role\`         enum('customer','worker','admin') NOT NULL DEFAULT 'customer',
      \`rating\`       decimal(3,1)    DEFAULT '5.0',
      \`totalRatings\` int             DEFAULT 0,
      \`isOnline\`     tinyint(1)      DEFAULT 0,
      \`createdAt\`    timestamp       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\`    timestamp       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`users_firebaseUid_unique\` (\`firebaseUid\`)
    )`,
    `CREATE TABLE IF NOT EXISTS \`orders\` (
      \`id\`                 varchar(36)  NOT NULL,
      \`customerId\`         bigint unsigned NOT NULL,
      \`workerId\`           bigint unsigned,
      \`serviceType\`        enum('delivery','shopping','cleaning','moving') NOT NULL,
      \`status\`             enum('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
      \`pickupAddress\`      text         NOT NULL,
      \`pickupLat\`          decimal(10,7) NOT NULL,
      \`pickupLng\`          decimal(10,7) NOT NULL,
      \`destinationAddress\` text         NOT NULL,
      \`destinationLat\`     decimal(10,7) NOT NULL,
      \`destinationLng\`     decimal(10,7) NOT NULL,
      \`price\`              int          NOT NULL,
      \`notes\`              text,
      \`cancelReason\`       text,
      \`cancelledBy\`        varchar(20),
      \`acceptedAt\`         timestamp    NULL,
      \`completedAt\`        timestamp    NULL,
      \`createdAt\`          timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\`          timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      CONSTRAINT \`orders_customerId_fk\` FOREIGN KEY (\`customerId\`) REFERENCES \`users\` (\`id\`),
      CONSTRAINT \`orders_workerId_fk\`   FOREIGN KEY (\`workerId\`)   REFERENCES \`users\` (\`id\`)
    )`,
    `CREATE TABLE IF NOT EXISTS \`ratings\` (
      \`id\`          bigint unsigned NOT NULL AUTO_INCREMENT,
      \`orderId\`     varchar(36)     NOT NULL,
      \`customerId\`  bigint unsigned NOT NULL,
      \`workerId\`    bigint unsigned NOT NULL,
      \`stars\`       tinyint         NOT NULL,
      \`comment\`     text,
      \`createdAt\`   timestamp       NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`ratings_orderId_unique\` (\`orderId\`),
      CONSTRAINT \`ratings_orderId_fk\`    FOREIGN KEY (\`orderId\`)    REFERENCES \`orders\` (\`id\`),
      CONSTRAINT \`ratings_customerId_fk\` FOREIGN KEY (\`customerId\`) REFERENCES \`users\`  (\`id\`),
      CONSTRAINT \`ratings_workerId_fk\`   FOREIGN KEY (\`workerId\`)   REFERENCES \`users\`  (\`id\`)
    )`,
  ];

  for (const stmt of DDL) {
    await db.execute(sql.raw(stmt));
  }

  console.log("[core] Schema verified (users, orders, ratings).");
}
