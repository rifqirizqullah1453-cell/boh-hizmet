CREATE TABLE `cleaning_service_types` (
	`slug` varchar(50) NOT NULL,
	`label` varchar(100) NOT NULL,
	`description` text,
	`priceMultiplier` decimal(4,2) NOT NULL DEFAULT '1.00',
	`durationMultiplier` decimal(4,2) NOT NULL DEFAULT '1.00',
	`sortOrder` int NOT NULL DEFAULT '0',
	CONSTRAINT `cleaning_service_types_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_property_types` (
	`slug` varchar(50) NOT NULL,
	`label` varchar(100) NOT NULL,
	`emoji` varchar(10),
	`sortOrder` int NOT NULL DEFAULT '0',
	CONSTRAINT `cleaning_property_types_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_base_rates` (
	`id` varchar(36) NOT NULL,
	`propertyTypeSlug` varchar(50) NOT NULL,
	`areaMin` int NOT NULL,
	`areaMax` int,
	`basePrice` int NOT NULL,
	`baseDurationHours` decimal(4,2) NOT NULL,
	`baseWorkers` int NOT NULL DEFAULT '1',
	CONSTRAINT `cleaning_base_rates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_room_fees` (
	`roomType` enum('bedroom','bathroom') NOT NULL,
	`pricePerUnit` int NOT NULL,
	`durationMinPerUnit` int NOT NULL,
	CONSTRAINT `cleaning_room_fees_roomType` PRIMARY KEY(`roomType`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_dirt_levels` (
	`slug` varchar(20) NOT NULL,
	`label` varchar(50) NOT NULL,
	`priceMultiplier` decimal(4,2) NOT NULL,
	`durationMultiplier` decimal(4,2) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT '0',
	CONSTRAINT `cleaning_dirt_levels_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_addons` (
	`slug` varchar(50) NOT NULL,
	`label` varchar(100) NOT NULL,
	`emoji` varchar(10),
	`price` int NOT NULL,
	`durationMin` int NOT NULL DEFAULT '0',
	`active` tinyint(1) NOT NULL DEFAULT '1',
	`sortOrder` int NOT NULL DEFAULT '0',
	CONSTRAINT `cleaning_addons_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_config` (
	`key` varchar(100) NOT NULL,
	`value` varchar(500) NOT NULL,
	`description` varchar(300),
	CONSTRAINT `cleaning_config_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `cleaning_orders` (
	`orderId` varchar(36) NOT NULL,
	`propertyTypeSlug` varchar(50) NOT NULL,
	`serviceTypeSlug` varchar(50) NOT NULL,
	`areaM2` int NOT NULL,
	`bedroomCount` int NOT NULL DEFAULT '0',
	`bathroomCount` int NOT NULL DEFAULT '0',
	`dirtLevelSlug` varchar(20) NOT NULL,
	`bringsEquipment` tinyint(1) NOT NULL DEFAULT '0',
	`addonSlugs` text NOT NULL,
	`estimatedHours` decimal(4,2) NOT NULL,
	`workerCount` int NOT NULL,
	`priceBreakdown` text NOT NULL,
	CONSTRAINT `cleaning_orders_orderId` PRIMARY KEY(`orderId`)
);
--> statement-breakpoint

-- ─── Seed: Service Types ──────────────────────────────────────────────────────
INSERT INTO `cleaning_service_types` (`slug`, `label`, `description`, `priceMultiplier`, `durationMultiplier`, `sortOrder`) VALUES
  ('general',  'General Cleaning',  'Pembersihan standar rutin — sapu, pel, lap debu, buang sampah',            '1.00', '1.00', 0),
  ('deep',     'Deep Cleaning',     'Pembersihan menyeluruh, termasuk sudut tersembunyi & kotoran membandel',  '1.50', '1.40', 1),
  ('move_in',  'Move In Cleaning',  'Pembersihan total sebelum pindah masuk ke hunian baru',                   '1.60', '1.50', 2),
  ('move_out', 'Move Out Cleaning', 'Pembersihan menyeluruh setelah pindah keluar',                            '1.70', '1.60', 3);
--> statement-breakpoint

-- ─── Seed: Property Types ─────────────────────────────────────────────────────
INSERT INTO `cleaning_property_types` (`slug`, `label`, `emoji`, `sortOrder`) VALUES
  ('rumah',     'Rumah',     '🏠', 0),
  ('apartemen', 'Apartemen', '🏢', 1),
  ('kantor',    'Kantor',    '🏗️',  2),
  ('kos',       'Kos',       '🛏️', 3);
--> statement-breakpoint

-- ─── Seed: Base Rate Matrix (property × area range) ──────────────────────────
INSERT INTO `cleaning_base_rates` (`id`, `propertyTypeSlug`, `areaMin`, `areaMax`, `basePrice`, `baseDurationHours`, `baseWorkers`) VALUES
  -- Rumah
  ('br-rumah-1', 'rumah',    0, 50,   300, '2.00', 1),
  ('br-rumah-2', 'rumah',   51, 100,  450, '3.00', 1),
  ('br-rumah-3', 'rumah',  101, 150,  600, '4.00', 2),
  ('br-rumah-4', 'rumah',  151, 200,  800, '5.00', 2),
  ('br-rumah-5', 'rumah',  201, 300, 1000, '6.50', 3),
  ('br-rumah-6', 'rumah',  301, NULL,1400, '8.00', 3),
  -- Apartemen
  ('br-apt-1',   'apartemen',  0,  40,  250, '1.50', 1),
  ('br-apt-2',   'apartemen', 41,  80,  350, '2.50', 1),
  ('br-apt-3',   'apartemen', 81, 120,  500, '3.50', 2),
  ('br-apt-4',   'apartemen',121, 200,  700, '4.50', 2),
  ('br-apt-5',   'apartemen',201, NULL, 900, '5.50', 3),
  -- Kantor
  ('br-kantor-1','kantor',   0,  60,  400, '2.50', 1),
  ('br-kantor-2','kantor',  61, 120,  600, '3.50', 2),
  ('br-kantor-3','kantor', 121, 200,  900, '5.00', 2),
  ('br-kantor-4','kantor', 201, 350, 1200, '6.50', 3),
  ('br-kantor-5','kantor', 351, NULL,1600, '8.00', 4),
  -- Kos
  ('br-kos-1',   'kos',  0,  20, 150, '1.00', 1),
  ('br-kos-2',   'kos', 21,  40, 200, '1.50', 1),
  ('br-kos-3',   'kos', 41, NULL,300, '2.00', 1);
--> statement-breakpoint

-- ─── Seed: Room Fees ─────────────────────────────────────────────────────────
INSERT INTO `cleaning_room_fees` (`roomType`, `pricePerUnit`, `durationMinPerUnit`) VALUES
  ('bedroom',  50, 30),
  ('bathroom', 75, 45);
--> statement-breakpoint

-- ─── Seed: Dirt Levels ───────────────────────────────────────────────────────
INSERT INTO `cleaning_dirt_levels` (`slug`, `label`, `priceMultiplier`, `durationMultiplier`, `sortOrder`) VALUES
  ('ringan', 'Ringan', '1.00', '1.00', 0),
  ('sedang', 'Sedang', '1.20', '1.20', 1),
  ('berat',  'Berat',  '1.50', '1.50', 2);
--> statement-breakpoint

-- ─── Seed: Addons ────────────────────────────────────────────────────────────
INSERT INTO `cleaning_addons` (`slug`, `label`, `emoji`, `price`, `durationMin`, `active`, `sortOrder`) VALUES
  ('kulkas',  'Kulkas',  '🧊',  100, 30, 1, 0),
  ('oven',    'Oven',    '🔥',  120, 45, 1, 1),
  ('sofa',    'Sofa',    '🛋️', 150, 45, 1, 2),
  ('kasur',   'Kasur',   '🛏️', 100, 30, 1, 3),
  ('jendela', 'Jendela', '🪟',   80, 30, 1, 4),
  ('balkon',  'Balkon',  '🌿',  120, 45, 1, 5),
  ('ac',      'AC',      '❄️',  150, 45, 1, 6),
  ('karpet',  'Karpet',  '🪣',  100, 30, 1, 7);
--> statement-breakpoint

-- ─── Seed: Config ────────────────────────────────────────────────────────────
INSERT INTO `cleaning_config` (`key`, `value`, `description`) VALUES
  ('weekend_multiplier', '1.25', 'Pengali harga untuk hari Sabtu & Minggu'),
  ('equipment_fee',      '100',  'Biaya jika pekerja membawa alat sendiri (TL)'),
  ('transport_base_km',  '3',    'Jarak awal bebas biaya transportasi (km)'),
  ('transport_per_km',   '20',   'Biaya transportasi per km di atas jarak dasar (TL)'),
  ('transport_max_fee',  '150',  'Batas maksimal biaya transportasi (TL)');
