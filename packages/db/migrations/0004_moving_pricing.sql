CREATE TABLE `moving_sizes` (
	`slug` varchar(50) NOT NULL,
	`label` varchar(100) NOT NULL,
	`description` text,
	`basePrice` int NOT NULL,
	`vehicleType` varchar(100) NOT NULL,
	`helperCount` int NOT NULL DEFAULT '1',
	`sortOrder` int NOT NULL DEFAULT '0',
	CONSTRAINT `moving_sizes_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `moving_heavy_items` (
	`slug` varchar(50) NOT NULL,
	`label` varchar(100) NOT NULL,
	`emoji` varchar(10),
	`price` int NOT NULL,
	`active` tinyint(1) NOT NULL DEFAULT '1',
	`sortOrder` int NOT NULL DEFAULT '0',
	CONSTRAINT `moving_heavy_items_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `moving_config` (
	`key` varchar(100) NOT NULL,
	`value` varchar(500) NOT NULL,
	`description` varchar(300),
	CONSTRAINT `moving_config_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `moving_orders` (
	`orderId` varchar(36) NOT NULL,
	`sizeSlug` varchar(50) NOT NULL,
	`pickupFloor` int NOT NULL DEFAULT '1',
	`destFloor` int NOT NULL DEFAULT '1',
	`hasLift` tinyint(1) NOT NULL DEFAULT '0',
	`heavyItemSlugs` text NOT NULL,
	`customHeavyItems` text NOT NULL,
	`scheduledAt` varchar(30),
	`priceBreakdown` text NOT NULL,
	CONSTRAINT `moving_orders_orderId` PRIMARY KEY(`orderId`)
);
--> statement-breakpoint

-- ─── Seed: Moving Sizes ──────────────────────────────────────────────────────
INSERT INTO `moving_sizes` (`slug`,`label`,`description`,`basePrice`,`vehicleType`,`helperCount`,`sortOrder`) VALUES
  ('kecil',  'Pindahan Kecil',  'Studio / kamar kos — barang sedikit, muat 1 truk pickup kecil', 1300, 'Pickup Kecil',  1, 0),
  ('sedang', 'Pindahan Sedang', '1–2 kamar — furnitur standar, perlu truk medium',               2000, 'Truk Medium',   2, 1),
  ('besar',  'Pindahan Besar',  '3+ kamar — furnitur lengkap, perlu truk besar',                 3000, 'Truk Besar',    3, 2);
--> statement-breakpoint

-- ─── Seed: Heavy Items ───────────────────────────────────────────────────────
INSERT INTO `moving_heavy_items` (`slug`,`label`,`emoji`,`price`,`active`,`sortOrder`) VALUES
  ('kulkas',       'Kulkas',        '🧊', 150, 1, 0),
  ('mesin_cuci',   'Mesin Cuci',    '🫧', 150, 1, 1),
  ('sofa',         'Sofa',          '🛋️', 200, 1, 2),
  ('lemari',       'Lemari',        '🚪', 175, 1, 3),
  ('tempat_tidur', 'Tempat Tidur',  '🛏️', 175, 1, 4),
  ('meja_makan',   'Meja Makan',    '🍽️', 150, 1, 5),
  ('meja_belajar', 'Meja Belajar',  '📚', 100, 1, 6);
--> statement-breakpoint

-- ─── Seed: Config ────────────────────────────────────────────────────────────
INSERT INTO `moving_config` (`key`,`value`,`description`) VALUES
  ('floor_base_surcharge', '200', 'Biaya dasar jika tidak ada lift dan lantai > 1 (TL)'),
  ('floor_per_floor_fee',  '75',  'Biaya tambahan per lantai di atas lantai 1 jika tidak ada lift (TL)'),
  ('weekend_multiplier',   '1.20','Pengali harga untuk hari Sabtu & Minggu'),
  ('custom_item_fee',      '125', 'Biaya per barang tambahan kustom yang diisi customer (TL)');
