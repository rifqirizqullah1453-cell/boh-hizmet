export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  emoji: string;
  popular?: boolean;
}

export interface ProductSection {
  category: string;
  items: Product[];
}

export type StoreType = 'supermarket' | 'restaurant' | 'cafe' | 'butcher' | 'fast_food' | 'pharmacy' | 'bakery';

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  emoji: string;
  tagline: string;
  rating: number;
  etaMin: number;
  minOrder: number;
  address: string;
  phone?: string;
  openingHours?: string;
  logo?: string;
  bannerColor?: string;
  sections: ProductSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// BİM
// ─────────────────────────────────────────────────────────────────────────────

const BIM: Store = {
  id: 'bim',
  name: 'BİM',
  type: 'supermarket',
  emoji: '🛒',
  tagline: 'Uygun fiyatlı market · 9 şube Bartın',
  rating: 4.1,
  etaMin: 20,
  minOrder: 50,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 09:00-21:00',
  logo: '/logos/bim.svg',
  bannerColor: '#E30613',
  sections: [
    {
      category: 'Meyve & Sebze',
      items: [
        { id: 'bim-mv1', name: 'Domates 1kg', description: 'Salkım domates', price: 39, unit: 'kg', emoji: '🍅', popular: true },
        { id: 'bim-mv2', name: 'Kokteyl Domates 500g', description: 'Taze, paket', price: 39.50, unit: 'paket', emoji: '🍅' },
        { id: 'bim-mv3', name: 'Patates 1kg', description: 'Yerli patates', price: 39.50, unit: 'kg', emoji: '🥔', popular: true },
        { id: 'bim-mv4', name: 'Sarımsak 250g', description: 'Taze yerli sarımsak', price: 43.75, unit: 'paket', emoji: '🧄' },
        { id: 'bim-mv5', name: 'Kiraz 500g', description: 'Taze kiraz', price: 49.50, unit: 'paket', emoji: '🍒' },
        { id: 'bim-mv6', name: 'Taze Kayısı 1kg', description: 'Mevsim kayısısı', price: 65, unit: 'kg', emoji: '🍑' },
        { id: 'bim-mv7', name: 'Kırmızı Erik 1kg', description: 'Taze erik', price: 99, unit: 'kg', emoji: '🍑' },
        { id: 'bim-mv8', name: 'Limon 500g', description: '4-5 adet limon', price: 59.50, unit: 'paket', emoji: '🍋' },
        { id: 'bim-mv9', name: 'Pembe Domates 500g', description: 'İri pembe domates', price: 99, unit: 'paket', emoji: '🍅' },
      ],
    },
    {
      category: 'Et, Tavuk & Şarküteri',
      items: [
        { id: 'bim-et1', name: 'Tombik Piliç Sosis 500g', description: 'Kokteyl piliç sosisi', price: 79, unit: 'paket', emoji: '🌭', popular: true },
        { id: 'bim-et2', name: 'Tazem Piliç Bonfile 600g', description: 'Taze piliç göğsü', price: 173.40, unit: 'paket', emoji: '🍗', popular: true },
        { id: 'bim-et3', name: 'Tazem Piliç Baget 1kg', description: 'Taze baget tavuk', price: 99, unit: 'kg', emoji: '🍗' },
        { id: 'bim-et4', name: 'Emin Dana Sucuk 380g', description: 'Baton dana sucuk', price: 249, unit: 'paket', emoji: '🌭', popular: true },
        { id: 'bim-et5', name: 'Coşkun Dana Sucuk 300g', description: 'Yarım ay dana sucuk', price: 290, unit: 'paket', emoji: '🌭' },
        { id: 'bim-et6', name: 'Tombik Kangal Sucuk 250g', description: 'Piliç sucuk kangal', price: 67.50, unit: 'paket', emoji: '🌭' },
        { id: 'bim-et7', name: 'Aytaç Piliç Sucuk 300g', description: 'Baton piliç sucuk', price: 85, unit: 'paket', emoji: '🌭' },
        { id: 'bim-et8', name: 'Namet Parmak Köfte 250g', description: 'Pişmiş hazır köfte', price: 155, unit: 'paket', emoji: '🥩' },
        { id: 'bim-et9', name: 'Emin Dana Kıyma 400g', description: '%20 yağlı dana kıyma', price: 275, unit: 'paket', emoji: '🥩', popular: true },
        { id: 'bim-et10', name: 'Emin Dana Kuşbaşı 400g', description: 'Taze dana kuşbaşı', price: 295, unit: 'paket', emoji: '🥩' },
        { id: 'bim-et11', name: 'Emin Dana & Kuzu Döner 300g', description: 'Hazır döner', price: 199, unit: 'paket', emoji: '🥙' },
        { id: 'bim-et12', name: 'Bgrill Piliç Döner 200g', description: 'Hazır piliç döner', price: 79, unit: 'paket', emoji: '🥙' },
        { id: 'bim-et13', name: 'Banvit Piliç Köfte 300g', description: 'Hazır piliç köftesi', price: 59, unit: 'paket', emoji: '🍖' },
        { id: 'bim-et14', name: 'Pınar Hindi Sosis 130g', description: 'Kokteyl hindi sosisi', price: 29, unit: 'paket', emoji: '🌭' },
        { id: 'bim-et15', name: 'Pınar Hindi Salam 500g', description: 'Açık büfe dilimli', price: 79, unit: 'paket', emoji: '🥓' },
      ],
    },
    {
      category: 'Süt & Süt Ürünleri',
      items: [
        { id: 'bim-s1', name: 'Dost Tereyağı 1kg', description: 'Pastörize tereyağı', price: 399, unit: 'paket', emoji: '🧈', popular: true },
        { id: 'bim-s2', name: 'Dost Süzme Beyaz Peynir 1kg', description: 'Tam yağlı süzme', price: 225, unit: 'kg', emoji: '🧀', popular: true },
        { id: 'bim-s3', name: 'Aknaz Beyaz Peynir 1kg', description: 'Tam yağlı salamura', price: 198, unit: 'kg', emoji: '🧀' },
        { id: 'bim-s4', name: 'Aknaz Eritme Peynir 250g', description: 'Tam yağlı eritme', price: 125, unit: 'paket', emoji: '🧀' },
        { id: 'bim-s5', name: 'Binvezir Taze Kaşar 500g', description: 'Taze kaşar peyniri', price: 199, unit: 'paket', emoji: '🧀' },
        { id: 'bim-s6', name: 'İçim Taze Kaşar 700g', description: 'Dilimleme kaşar', price: 295, unit: 'paket', emoji: '🧀' },
        { id: 'bim-s7', name: 'Otat Vadim Tost Peyniri 1kg', description: 'Yarım yağlı dilimli', price: 319, unit: 'kg', emoji: '🧀' },
        { id: 'bim-s8', name: 'Kerem Krem Peynir 200g', description: 'Sürülebilir taze peynir', price: 62.50, unit: 'kase', emoji: '🧀' },
        { id: 'bim-s9', name: 'Kaanlar Lor Peyniri 500g', description: 'Yöresel tam yağlı lor', price: 65, unit: 'paket', emoji: '🧀' },
        { id: 'bim-s10', name: 'Dost Homojenize Yoğurt 500g', description: 'Tam yağlı yoğurt', price: 36.50, unit: 'kase', emoji: '🥛', popular: true },
        { id: 'bim-s11', name: 'Activia Probiyotik Yoğurt 4x100g', description: 'Sade probiyotik yoğurt', price: 114.50, unit: 'paket', emoji: '🥛' },
        { id: 'bim-s12', name: 'Dost Yağlı Süt 200ml', description: 'UHT tam yağlı süt', price: 14.50, unit: 'kutu', emoji: '🥛' },
        { id: 'bim-s13', name: 'Dost Kefir 1L', description: 'Orman meyveli kefir', price: 79.50, unit: 'şişe', emoji: '🥛' },
        { id: 'bim-s14', name: 'Daphne Krem Şanti 150g', description: 'Vanilyalı krem şanti', price: 37, unit: 'kutu', emoji: '🍦' },
      ],
    },
    {
      category: 'Kahvaltılık',
      items: [
        { id: 'bim-kh1', name: 'Bili Bili Yumurta 15\'li', description: 'L/XL beden yumurta', price: 69, unit: 'koli', emoji: '🥚', popular: true },
        { id: 'bim-kh2', name: 'İlkgün Vişne Reçeli 380g', description: 'Vişne reçeli', price: 62.50, unit: 'kavanoz', emoji: '🍓', popular: true },
        { id: 'bim-kh3', name: 'İlkgün Ahududu Reçeli 380g', description: 'Ahududu reçeli', price: 67, unit: 'kavanoz', emoji: '🍓' },
        { id: 'bim-kh4', name: 'İlkgün Böğürtlen Reçeli 380g', description: 'Böğürtlen reçeli', price: 67, unit: 'kavanoz', emoji: '🫐' },
        { id: 'bim-kh5', name: 'İlkgün Çilek Reçeli 1000g', description: 'Büyük boy çilek reçeli', price: 126, unit: 'kavanoz', emoji: '🍓' },
        { id: 'bim-kh6', name: 'İnci Siyah Zeytin 250g', description: 'Salamura yağlı siyah', price: 58.50, unit: 'kase', emoji: '🫒' },
        { id: 'bim-kh7', name: 'İnci Siyah Zeytin 1kg', description: 'Büyük boy salamura', price: 135, unit: 'kg', emoji: '🫒' },
        { id: 'bim-kh8', name: 'Balparmak Bal 460g', description: 'Çıt kapak çiçek balı', price: 325, unit: 'kavanoz', emoji: '🍯', popular: true },
        { id: 'bim-kh9', name: 'Serel Tahin 1000g', description: 'Çifte kavrulmuş tahin', price: 154.50, unit: 'kavanoz', emoji: '🫙' },
        { id: 'bim-kh10', name: 'Peripella Fındık Kreması 400g', description: 'Kakaolu fındık kreması', price: 109, unit: 'kavanoz', emoji: '🍫' },
        { id: 'bim-kh11', name: 'Sayley Fındık Kreması 500g', description: 'Sütlü & kakaolu fındık kreması', price: 89, unit: 'kavanoz', emoji: '🍫' },
        { id: 'bim-kh12', name: 'Kelly\'s Mısır Gevreği 500g', description: 'Ballı mısır gevreği', price: 79.50, unit: 'kutu', emoji: '🥣' },
      ],
    },
    {
      category: 'Çay & Kahve',
      items: [
        { id: 'bim-ck1', name: 'Lipton Dökme Çay 1kg', description: 'Doğu Karadeniz siyah çay', price: 320, unit: 'paket', emoji: '🍵', popular: true },
        { id: 'bim-ck2', name: 'Berk Filiz Çay 500g', description: 'Rize siyah çay', price: 120, unit: 'paket', emoji: '🍵' },
        { id: 'bim-ck3', name: 'Lipton Demlik Poşet 48\'li', description: '3.2g demlik poşet çay', price: 139, unit: 'kutu', emoji: '🍵' },
        { id: 'bim-ck4', name: 'Doğadan Yeşil Çay 20\'li', description: 'Sade yeşil çay', price: 110, unit: 'kutu', emoji: '🍵' },
        { id: 'bim-ck5', name: 'Doğadan Form Bitki Çayı 20\'li', description: 'Bitki çayı karışımı', price: 110, unit: 'kutu', emoji: '🌿' },
        { id: 'bim-ck6', name: 'Nescafé Classic 100g', description: 'Hazır siyah kahve', price: 199, unit: 'kutu', emoji: '☕', popular: true },
        { id: 'bim-ck7', name: 'Nescafé 3\'ü 1 Arada 10\'lu', description: '17.4g x 10 adet', price: 105, unit: 'kutu', emoji: '☕' },
        { id: 'bim-ck8', name: 'Jacobs Filtre Kahve 250g', description: 'Öğütülmüş filtre kahve', price: 339, unit: 'paket', emoji: '☕' },
        { id: 'bim-ck9', name: 'Vip 2\'si 1 Arada 12g', description: 'Hazır sütlü kahve', price: 4.50, unit: 'adet', emoji: '☕' },
      ],
    },
    {
      category: 'Su & İçecek',
      items: [
        { id: 'bim-i1', name: 'Lipton Ice Tea Mango 1L', description: 'Soğuk mango çay içeceği', price: 49.50, unit: 'şişe', emoji: '🧃', popular: true },
        { id: 'bim-i2', name: 'Lipton Ice Tea Şeftali 2L', description: 'Büyük boy soğuk çay', price: 76, unit: 'şişe', emoji: '🧃' },
        { id: 'bim-i3', name: 'Pepsi Zero 1L', description: 'Şekersiz kola', price: 57, unit: 'şişe', emoji: '🥤', popular: true },
        { id: 'bim-i4', name: 'Fruko Gazoz 2.5L', description: 'Pet şişe gazoz', price: 67, unit: 'şişe', emoji: '🥤' },
        { id: 'bim-i5', name: 'Red Bull 250ml', description: 'Enerji içeceği', price: 70, unit: 'kutu', emoji: '⚡' },
        { id: 'bim-i6', name: 'Özkaynak Maden Suyu 6x200ml', description: 'Sade maden suyu', price: 49.50, unit: 'paket', emoji: '💧' },
        { id: 'bim-i7', name: 'Siri Bubble Tea 350ml', description: 'Misket limon bubble tea', price: 59.50, unit: 'şişe', emoji: '🧋' },
        { id: 'bim-i8', name: 'Jucy Vişne Nektarı 200ml', description: 'Meyve nektarı', price: 15, unit: 'kutu', emoji: '🧃' },
        { id: 'bim-i9', name: 'Performans İçecek 250ml', description: 'Multivitaminli içecek', price: 25, unit: 'kutu', emoji: '💪' },
      ],
    },
    {
      category: 'Temel Gıda',
      items: [
        { id: 'bim-t1', name: 'Efsane Pirinç 2.5kg', description: 'Ekonomik pilavlık pirinç', price: 119, unit: 'torba', emoji: '🌾', popular: true },
        { id: 'bim-t2', name: 'Sole Ayçiçek Yağı 2L', description: 'Rafine ayçiçek yağı', price: 220, unit: 'şişe', emoji: '🌻', popular: true },
        { id: 'bim-t3', name: 'Yurdum Domates Salçası 830g', description: 'Sera domates salçası', price: 48.75, unit: 'teneke', emoji: '🍅' },
        { id: 'bim-t4', name: 'Fıçı Nar Ekşisi 250ml', description: '%100 doğal nar ekşisi', price: 115, unit: 'şişe', emoji: '🫙' },
        { id: 'bim-t5', name: 'Destan Pul Biber 100g', description: 'Kırmızı pul biber', price: 38.50, unit: 'paket', emoji: '🌶️' },
        { id: 'bim-t6', name: 'Destan Karabiber 75g', description: 'Öğütülmüş karabiber', price: 51.50, unit: 'paket', emoji: '🫙' },
        { id: 'bim-t7', name: 'Destan Tarçın 75g', description: 'Öğütülmüş tarçın', price: 30, unit: 'paket', emoji: '🫙' },
        { id: 'bim-t8', name: 'Destan Nane 30g', description: 'Kuru nane', price: 15.75, unit: 'paket', emoji: '🌿' },
        { id: 'bim-t9', name: 'Destan Karbonat 500g', description: 'Yemek karbonatı', price: 33.50, unit: 'paket', emoji: '🫙' },
        { id: 'bim-t10', name: 'Serel Tahin Helvası 500g', description: 'Antep fıstıklı helva', price: 139, unit: 'paket', emoji: '🍫' },
        { id: 'bim-t11', name: 'Söke Glutensiz Un 250g', description: 'Glutensiz un karışımı', price: 29.50, unit: 'paket', emoji: '🌾' },
        { id: 'bim-t12', name: 'Yurdum Barbunya Pilaki 400g', description: 'Hazır barbunya pilaki', price: 40, unit: 'kutu', emoji: '🫘' },
      ],
    },
    {
      category: 'Atıştırmalık',
      items: [
        { id: 'bim-at1', name: 'Party Taco Mısır Çerezi 200g', description: 'Taco aromalı mısır çerezi', price: 52, unit: 'paket', emoji: '🌽', popular: true },
        { id: 'bim-at2', name: 'Party Nacho Peynir 200g', description: 'Peynir aromalı nacho', price: 52, unit: 'paket', emoji: '🌽' },
        { id: 'bim-at3', name: 'Party Barbekü Mısır 200g', description: 'Barbekü aromalı çerez', price: 52, unit: 'paket', emoji: '🌽' },
        { id: 'bim-at4', name: 'Doritos 130g', description: 'Hot corn mısır cipsi', price: 62, unit: 'paket', emoji: '🍟', popular: true },
        { id: 'bim-at5', name: 'Simbat Fındık 150g', description: 'Kavrulmuş tuzlu fındık', price: 137, unit: 'paket', emoji: '🌰' },
        { id: 'bim-at6', name: 'Buono Badem Draje 150g', description: 'Çikolata kaplı badem', price: 78, unit: 'paket', emoji: '🍫' },
        { id: 'bim-at7', name: 'Süsse Finger Bisküvi 450g', description: 'Parmak bisküvi', price: 38.50, unit: 'paket', emoji: '🍪' },
        { id: 'bim-at8', name: 'Süsse Portakal Jöleli 114g', description: 'Portakal jöleli bisküvi', price: 14, unit: 'paket', emoji: '🍊' },
        { id: 'bim-at9', name: 'Bifa Keks Marshmallow 175g', description: 'Marshmallow kare kek', price: 45, unit: 'paket', emoji: '🍰' },
        { id: 'bim-at10', name: 'Simbat Yer Fıstıklı Krokan 30g', description: 'Yer fıstıklı şekerleme', price: 9.50, unit: 'adet', emoji: '🥜' },
      ],
    },
    {
      category: 'Dondurulmuş Gıda',
      items: [
        { id: 'bim-dg1', name: 'Mutfağım Mantı 450g', description: 'Dondurulmuş hazır mantı', price: 37.50, unit: 'paket', emoji: '🥟', popular: true },
        { id: 'bim-dg2', name: 'Lezzethane Börek 650g', description: 'Peynirli tepsi böreği', price: 99, unit: 'paket', emoji: '🥧', popular: true },
        { id: 'bim-dg3', name: 'Lezzethane Sigara Böreği 400g', description: '3 çeşit peynirli sigara', price: 47.50, unit: 'paket', emoji: '🥧' },
        { id: 'bim-dg4', name: 'SuperFresh Pizza 600g', description: 'King Slimmo pizza', price: 169, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'bim-dg5', name: 'Lezzethane Pizza 4\'lü 820g', description: 'Karışık mini pizza', price: 129, unit: 'paket', emoji: '🍕' },
        { id: 'bim-dg6', name: 'Lezzethane Kuşbaşılı Pide 400g', description: 'Kaşarlı kuşbaşı pide', price: 179, unit: 'paket', emoji: '🫓' },
        { id: 'bim-dg7', name: 'Mutfağım Çıtır Patates 1kg', description: 'İnce çıtır patates kızartması', price: 85, unit: 'paket', emoji: '🍟' },
        { id: 'bim-dg8', name: 'Mutfağım Dondurulmuş Mısır 450g', description: 'Taze dondurulmuş mısır', price: 52.50, unit: 'paket', emoji: '🌽' },
        { id: 'bim-dg9', name: 'Erba Sea Food Somon 450g', description: 'Norveç somon dilim', price: 299, unit: 'paket', emoji: '🐟' },
        { id: 'bim-dg10', name: 'Lezzethane Ispanaklı Börek 650g', description: 'Ispanaklı peynirli tepsi böreği', price: 99, unit: 'paket', emoji: '🥧' },
      ],
    },
    {
      category: 'Dondurma',
      items: [
        { id: 'bim-don1', name: 'Fair Dondurma 1500ml', description: 'Çilek, vanilya & kakaolu', price: 99, unit: 'kova', emoji: '🍨', popular: true },
        { id: 'bim-don2', name: 'Magnum Antep Fıstığı 90ml', description: 'Signature serisi', price: 90, unit: 'adet', emoji: '🍦', popular: true },
        { id: 'bim-don3', name: 'Magnum Beyaz 100ml', description: 'Beyaz çikolata kaplı', price: 90, unit: 'adet', emoji: '🍦' },
        { id: 'bim-don4', name: 'Magnum Mini Cookie 338ml', description: 'Mini bademli & cookie', price: 325, unit: 'paket', emoji: '🍪' },
        { id: 'bim-don5', name: 'Algida Carte d\'Or 850ml', description: 'Klasik dondurma', price: 275, unit: 'kutu', emoji: '🍨' },
        { id: 'bim-don6', name: 'Fair Gold Dondurma 900ml', description: 'Çikolata keyfi', price: 190, unit: 'kova', emoji: '🍫' },
        { id: 'bim-don7', name: 'Adora Antep Fıstığı 90ml', description: 'Antep fıstıklı dondurma', price: 60, unit: 'adet', emoji: '🍦' },
        { id: 'bim-don8', name: 'Adora Karadutlu 100ml', description: 'Karadut aromalı', price: 60, unit: 'adet', emoji: '🫐' },
        { id: 'bim-don9', name: 'Miskos Külah 10\'lu', description: 'Dondurma külahı', price: 23.50, unit: 'paket', emoji: '🍦' },
        { id: 'bim-don10', name: 'Kidy Çilekli Dondurma 70ml', description: 'Çocuk dondurması', price: 13, unit: 'adet', emoji: '🍓' },
      ],
    },
    {
      category: 'Fırından',
      items: [
        { id: 'bim-f1', name: 'Ekmek Adet', description: 'Günlük taze ekmek', price: 17.50, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'bim-f2', name: 'Beyaz Ekmek Büyük', description: 'Büyük boy taze ekmek', price: 55, unit: 'adet', emoji: '🍞' },
        { id: 'bim-f3', name: 'Ekmecik Kepekli 400g', description: 'Kepekli ekmek', price: 34, unit: 'adet', emoji: '🍞' },
        { id: 'bim-f4', name: 'Ekmecik Köy Ekmeği 600g', description: 'Köy ekmeği', price: 59, unit: 'adet', emoji: '🍞' },
        { id: 'bim-f5', name: 'Ekmecik Sandviç 7x65g', description: 'Sandviç ekmeği', price: 65, unit: 'paket', emoji: '🥖' },
        { id: 'bim-f6', name: 'Unlüx Hamburger Ekmeği 4x100g', description: 'Susamlı hamburger ekmeği', price: 69, unit: 'paket', emoji: '🍔' },
        { id: 'bim-f7', name: 'Unlüx Sandviç Ekmeği 4x100g', description: 'Susamlı sandviç ekmeği', price: 73.50, unit: 'paket', emoji: '🥖' },
        { id: 'bim-f8', name: 'Lezzethane Kavala Kurabiyesi 290g', description: 'Bademli Kavala kurabiyesi', price: 79, unit: 'paket', emoji: '🍪' },
        { id: 'bim-f9', name: 'Lezzethane Sütlü Kurabiye 400g', description: 'Süt kaymaklı kurabiye', price: 99, unit: 'paket', emoji: '🍪' },
      ],
    },
    {
      category: 'Hızlı Yemek',
      items: [
        { id: 'bim-hy1', name: 'M.Z. Ege Rus Salatası 250g', description: 'Hazır rus salatası', price: 31.50, unit: 'kase', emoji: '🥗', popular: true },
        { id: 'bim-hy2', name: 'M.Z. Ege Çiğ Köfte 384g', description: 'Etsiz çiğ köfte', price: 32.50, unit: 'paket', emoji: '🫓' },
        { id: 'bim-hy3', name: 'M.Z. Ege Dürüm Çiğ Köfte 180g', description: 'Hazır dürüm çiğ köfte', price: 21.50, unit: 'adet', emoji: '🌯' },
        { id: 'bim-hy4', name: 'M.Z. Ege Çıtır Tavuk Burger 180g', description: 'Hazır çıtır tavuk burger', price: 48, unit: 'adet', emoji: '🍔' },
        { id: 'bim-hy5', name: 'Mr. NO Kaşar Salamlı Sandviç 130g', description: 'Hazır sandviç', price: 36.50, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'bim-hy6', name: 'Mr. NO Bol Peynirli Sandviç 130g', description: 'Hazır peynirli sandviç', price: 36.50, unit: 'adet', emoji: '🥪' },
      ],
    },
    {
      category: 'Ev Bakım',
      items: [
        { id: 'bim-ev1', name: 'Bulut Yumuşatıcı 1500ml', description: 'Çamaşır yumuşatıcısı', price: 101, unit: 'şişe', emoji: '🧺', popular: true },
        { id: 'bim-ev2', name: 'Bulut Yumuşatıcı Soft 3L', description: 'Büyük boy yumuşatıcı', price: 120, unit: 'şişe', emoji: '🧺' },
        { id: 'bim-ev3', name: 'Bind Bulaşık Tableti 50\'li', description: 'Activit bulaşık makinesi tableti', price: 175, unit: 'kutu', emoji: '🍽️', popular: true },
        { id: 'bim-ev4', name: 'Cif Krem 500ml', description: 'Amonyaklı temizleyici krem', price: 59, unit: 'şişe', emoji: '✨' },
        { id: 'bim-ev5', name: 'Aks Cam Temizleyici 1L', description: 'Cam ve yüzey temizleyici', price: 49, unit: 'şişe', emoji: '🪟' },
        { id: 'bim-ev6', name: 'Aks Banyo Temizleyici 1L', description: 'Bril banyo temizleyici', price: 80.50, unit: 'şişe', emoji: '🚿' },
        { id: 'bim-ev7', name: 'Sleepy Temizlik Havlusu 100\'lü', description: 'Yüzey temizlik havlusu', price: 119, unit: 'paket', emoji: '🧻' },
        { id: 'bim-ev8', name: 'Protex Pişirme Kağıdı 16\'lı', description: 'Yağlı pişirme kağıdı', price: 37.50, unit: 'paket', emoji: '📄' },
        { id: 'bim-ev9', name: 'Santa Kağıt Bardak 20\'li 7oz', description: 'Tek kullanımlık kağıt bardak', price: 22, unit: 'paket', emoji: '☕' },
      ],
    },
    {
      category: 'Kağıt Ürünleri',
      items: [
        { id: 'bim-kk1', name: 'Blume Kağıt Havlu 6\'lı', description: 'Beyaz kağıt havlu', price: 89, unit: 'paket', emoji: '🧻', popular: true },
        { id: 'bim-kk2', name: 'Blume Dev Kağıt Havlu', description: 'Dev rulo kağıt havlu', price: 68, unit: 'adet', emoji: '🧻' },
        { id: 'bim-kk3', name: 'Queen Dev Rulo 300 Yaprak', description: 'Dev rulo kağıt havlu', price: 48.50, unit: 'adet', emoji: '🧻' },
        { id: 'bim-kk4', name: 'Blume Kağıt Mendil 10\'lu', description: '3 katlı kağıt mendil', price: 30, unit: 'paket', emoji: '🤧' },
        { id: 'bim-kk5', name: 'Ivory Islak Havlu Cep 3x15', description: 'Cep ıslak mendili', price: 23, unit: 'paket', emoji: '🧴' },
        { id: 'bim-kk6', name: 'Pofu Islak Havlu 50\'li', description: 'Islak temizlik havlusu', price: 14, unit: 'paket', emoji: '🧴' },
        { id: 'bim-kk7', name: 'Blume Peçete 100\'lü', description: 'Beyaz kağıt peçete', price: 29.50, unit: 'paket', emoji: '🍽️' },
        { id: 'bim-kk8', name: 'Blume Peçete 200\'lü', description: 'Büyük boy peçete', price: 27, unit: 'paket', emoji: '🍽️' },
      ],
    },
    {
      category: 'Kişisel Bakım',
      items: [
        { id: 'bim-kb1', name: 'Elidor Şampuan 400ml', description: 'Güçlü & parlak şampuan', price: 199, unit: 'şişe', emoji: '🧴', popular: true },
        { id: 'bim-kb2', name: 'Clear Men Şampuan 350ml', description: 'Kepek önleyici şampuan', price: 229, unit: 'şişe', emoji: '🧴' },
        { id: 'bim-kb3', name: 'Dove Cream Bar', description: 'Fresh touch nemlendirici sabun', price: 64.50, unit: 'adet', emoji: '🧼', popular: true },
        { id: 'bim-kb4', name: 'Dalan Zeytinyağlı Sabun 900g', description: 'Zeytinyağlı sabun', price: 155, unit: 'paket', emoji: '🧼' },
        { id: 'bim-kb5', name: 'Dushy Duş Jeli 500ml', description: 'Nemlendirici duş jeli', price: 58.50, unit: 'şişe', emoji: '🚿' },
        { id: 'bim-kb6', name: 'Nivea Invisible Roll-on 25ml', description: 'B&W invisible deodorant', price: 62.50, unit: 'adet', emoji: '🧴' },
        { id: 'bim-kb7', name: 'Nivea Men Roll-on 25ml', description: 'Erkek deodorant', price: 62.50, unit: 'adet', emoji: '🧴' },
        { id: 'bim-kb8', name: 'Shela Bayan Deodorant 150ml', description: 'Kadın deodorant spreyi', price: 78, unit: 'adet', emoji: '🌸' },
        { id: 'bim-kb9', name: 'Man\'s Tıraş Bıçağı 6\'lı', description: 'Tek bıçaklı tıraş bıçağı', price: 60, unit: 'paket', emoji: '🪒' },
        { id: 'bim-kb10', name: 'Mercy Rebul Erkek Parfüm 50ml', description: 'Black Edp erkek parfümü', price: 150, unit: 'adet', emoji: '🌟' },
      ],
    },
    {
      category: 'Bebek',
      items: [
        { id: 'bim-bb1', name: 'Jenny & Willy Bezi Midi 50\'li', description: 'Bebek bezi 3 numara', price: 199, unit: 'paket', emoji: '👶', popular: true },
        { id: 'bim-bb2', name: 'Jenny & Willy Bezi Maxi 44\'lü', description: 'Bebek bezi 4 numara', price: 199, unit: 'paket', emoji: '👶' },
        { id: 'bim-bb3', name: 'Jenny & Willy Bezi YD 20\'li', description: 'Yenidoğan bebek bezi', price: 53.50, unit: 'paket', emoji: '👶' },
        { id: 'bim-bb4', name: 'Jenny & Willy Bezi Mini 40\'lı', description: 'Bebek bezi 2 numara', price: 132.50, unit: 'paket', emoji: '👶' },
        { id: 'bim-bb5', name: 'Jenny & Willy Bezi XL 30\'lu', description: 'Bebek bezi 5 numara', price: 199, unit: 'paket', emoji: '👶' },
        { id: 'bim-bb6', name: 'Hero Baby Mama 125g', description: 'Kavanoz mama 6+ ay', price: 42.50, unit: 'kavanoz', emoji: '🍼', popular: true },
        { id: 'bim-bb7', name: 'Hero Baby Elmalı & Muzlu 125g', description: 'Meyveli kavanoz mama 4+ ay', price: 42.50, unit: 'kavanoz', emoji: '🍼' },
        { id: 'bim-bb8', name: 'Hero Baby 8 Tahıllı Mama 400g', description: 'Sütlü meyveli tahıllı mama 6+ ay', price: 229, unit: 'kutu', emoji: '🍼' },
        { id: 'bim-bb9', name: 'Mamamil 2 Devam Sütü 400g', description: 'Bebek devam sütü 6-12 ay', price: 199, unit: 'kutu', emoji: '🍼' },
      ],
    },
    {
      category: 'Pet Shop',
      items: [
        { id: 'bim-pt1', name: 'Felix Kedi Maması 4x85g', description: 'Balıklı yaş kedi maması', price: 87, unit: 'paket', emoji: '🐱', popular: true },
        { id: 'bim-pt2', name: 'Jungle Kedi Maması 100g', description: 'Sokak kedileri için', price: 25, unit: 'paket', emoji: '🐱' },
        { id: 'bim-pt3', name: 'Jungle Köpek Maması 125g', description: 'Sokak köpekleri için', price: 25, unit: 'paket', emoji: '🐶' },
      ],
    },
  ],
};


// ─────────────────────────────────────────────────────────────────────────────
// A101
// ─────────────────────────────────────────────────────────────────────────────

const A101: Store = {
  id: 'a101',
  name: 'A101',
  type: 'supermarket',
  emoji: '🛍️',
  tagline: 'Her gün düşük fiyat · 2 şube Bartın',
  rating: 4.2,
  etaMin: 18,
  minOrder: 50,
  address: 'Bartın Merkez',
  logo: '/logos/a101.svg',
  bannerColor: '#00B8CD',
  openingHours: 'Mo-Su 09:00-21:30',
  sections: [
    {
      category: 'Meyve',
      items: [
        { id: 'a101-mv1', name: 'Karpuz Kg', description: 'Taze karpuz', price: 16.90, unit: 'kg', emoji: '🍉', popular: true },
        { id: 'a101-mv2', name: 'Kavun Kg', description: 'Taze kavun', price: 26.90, unit: 'kg', emoji: '🍈', popular: true },
        { id: 'a101-mv3', name: 'Sıkma Portakal File Kg', description: 'Sıkmalık portakal', price: 32.90, unit: 'kg', emoji: '🍊' },
        { id: 'a101-mv4', name: 'Portakal Kg', description: 'Taze portakal', price: 44.90, unit: 'kg', emoji: '🍊' },
        { id: 'a101-mv5', name: 'Atıştırmalık Starking Elma 1 Kg', description: 'Starking elma', price: 54.90, unit: 'kg', emoji: '🍎' },
        { id: 'a101-mv6', name: 'Atıştırmalık Golden Elma 1 Kg', description: 'Golden elma', price: 54.90, unit: 'kg', emoji: '🍏' },
        { id: 'a101-mv7', name: 'Kayısı Kg', description: 'Taze kayısı', price: 65.90, unit: 'kg', emoji: '🍑' },
        { id: 'a101-mv8', name: 'Starking Elma Kg', description: 'İndirimli starking elma', price: 69.50, unit: 'kg', emoji: '🍎' },
        { id: 'a101-mv9', name: 'Kiraz Paket 500 G', description: '500g kiraz paketi', price: 75.90, unit: 'paket', emoji: '🍒', popular: true },
        { id: 'a101-mv10', name: 'Şeftali Kg', description: 'Taze şeftali', price: 79.50, unit: 'kg', emoji: '🍑' },
        { id: 'a101-mv11', name: 'Mango Adet', description: 'Olgun mango', price: 84.90, unit: 'adet', emoji: '🥭' },
        { id: 'a101-mv12', name: 'Limon Kg', description: 'Taze limon', price: 89.50, unit: 'kg', emoji: '🍋' },
        { id: 'a101-mv13', name: 'Erik Papaz Paket 500 G', description: '500g papaz erikli', price: 89.50, unit: 'paket', emoji: '🍑' },
        { id: 'a101-mv14', name: 'Nektarin Kg', description: 'Taze nektarin', price: 89.50, unit: 'kg', emoji: '🍑' },
        { id: 'a101-mv15', name: 'Granny Smith Elma Kg', description: 'Yeşil elma', price: 94.90, unit: 'kg', emoji: '🍏' },
        { id: 'a101-mv16', name: 'Ananas Adet', description: 'Taze ananas', price: 99.50, unit: 'adet', emoji: '🍍' },
        { id: 'a101-mv17', name: 'İthal Muz Kg', description: 'İthal muz', price: 99.50, unit: 'kg', emoji: '🍌' },
        { id: 'a101-mv18', name: 'Deveci Armut Kg', description: 'Deveci armut', price: 99.50, unit: 'kg', emoji: '🍐' },
        { id: 'a101-mv19', name: 'Yerli Muz Kg', description: 'Yerli muz', price: 99.50, unit: 'kg', emoji: '🍌' },
        { id: 'a101-mv20', name: 'Avokado Adet', description: 'Olgun avokado', price: 39.50, unit: 'adet', emoji: '🥑' },
        { id: 'a101-mv21', name: 'Hindistan Cevizi Adet', description: 'Taze hindistan cevizi', price: 64.90, unit: 'adet', emoji: '🥥' },
        { id: 'a101-mv22', name: 'Yaban Mersini Paket 125 G', description: '125g yaban mersini', price: 69.50, unit: 'paket', emoji: '🫐' },
        { id: 'a101-mv23', name: 'Santa Maria Armut Kg', description: 'Santa Maria armut', price: 109.50, unit: 'kg', emoji: '🍐' },
        { id: 'a101-mv24', name: 'Kivi Kg', description: 'Taze kivi', price: 119.50, unit: 'kg', emoji: '🥝' },
      ],
    },
    {
      category: 'Sebze',
      items: [
        { id: 'a101-sb1', name: 'Sivri Biber Paket 300 G', description: 'Taze sivri biber', price: 27.90, unit: 'paket', emoji: '🌿' },
        { id: 'a101-sb2', name: 'Çarliston Biber Paket 300 G', description: 'Taze çarliston biber', price: 29.50, unit: 'paket', emoji: '🌶️' },
        { id: 'a101-sb3', name: 'Şeker Domates Paket 250 G', description: '250g şeker domates', price: 34.90, unit: 'paket', emoji: '🍅' },
        { id: 'a101-sb4', name: 'Kırmızı Biber Paket 300 G', description: 'Taze kırmızı biber', price: 34.90, unit: 'paket', emoji: '🫑' },
        { id: 'a101-sb5', name: 'Dolma Biber Paket 300 G', description: 'Dolmalık biber', price: 34.90, unit: 'paket', emoji: '🫑' },
        { id: 'a101-sb6', name: 'Çengelköy Salatalık Paket 500 G', description: '500g çengelköy salatalık', price: 34.90, unit: 'paket', emoji: '🥒' },
        { id: 'a101-sb7', name: 'Şili Biber Paket 150 G', description: 'Acı şili biber', price: 35.90, unit: 'paket', emoji: '🌶️' },
        { id: 'a101-sb8', name: 'Soğan Kg', description: 'Kuru soğan', price: 37.90, unit: 'kg', emoji: '🧅', popular: true },
        { id: 'a101-sb9', name: 'Domates Kg', description: 'Salkım domates', price: 39.50, unit: 'kg', emoji: '🍅', popular: true },
        { id: 'a101-sb10', name: 'Salatalık Kg', description: 'Taze salatalık', price: 39.50, unit: 'kg', emoji: '🥒', popular: true },
        { id: 'a101-sb11', name: 'Patates Kg', description: 'Yerli patates', price: 39.50, unit: 'kg', emoji: '🥔', popular: true },
        { id: 'a101-sb12', name: 'Kızartmalık File Patates Kg', description: 'Kızartmalık patates', price: 39.50, unit: 'kg', emoji: '🍟' },
        { id: 'a101-sb13', name: 'Pırasa Paket 500 G', description: '500g taze pırasa', price: 39.50, unit: 'paket', emoji: '🌿' },
        { id: 'a101-sb14', name: 'Sarımsak File 200 G', description: '200g sarımsak', price: 43.90, unit: 'paket', emoji: '🧄' },
        { id: 'a101-sb15', name: 'Kokteyl Domates Paket 500 G', description: '500g kokteyl domates', price: 49.50, unit: 'paket', emoji: '🍅' },
        { id: 'a101-sb16', name: 'Salkım Domates Paket 500 G', description: '500g salkım domates', price: 49.50, unit: 'paket', emoji: '🍅' },
        { id: 'a101-sb17', name: 'Pembe Domates Paket 500 G', description: '500g pembe domates', price: 39.50, unit: 'paket', emoji: '🍅' },
        { id: 'a101-sb18', name: 'Mantar Tabak 300 G', description: '300g kültür mantarı', price: 54.90, unit: 'tabak', emoji: '🍄' },
        { id: 'a101-sb19', name: 'Patlıcan Kg', description: 'Siyah patlıcan', price: 59.50, unit: 'kg', emoji: '🍆' },
        { id: 'a101-sb20', name: 'Kabak Kg', description: 'Taze kabak', price: 59.50, unit: 'kg', emoji: '🥬' },
      ],
    },
    {
      category: 'Yeşillik',
      items: [
        { id: 'a101-ys1', name: 'Roka Adet', description: 'Taze roka', price: 19.50, unit: 'demet', emoji: '🌿' },
        { id: 'a101-ys2', name: 'Nane Adet', description: 'Taze nane', price: 19.50, unit: 'demet', emoji: '🌿' },
        { id: 'a101-ys3', name: 'Maydanoz Adet', description: 'Taze maydanoz', price: 21.90, unit: 'demet', emoji: '🌿' },
        { id: 'a101-ys4', name: 'Dereotu Adet', description: 'Taze dereotu', price: 29.50, unit: 'demet', emoji: '🌿' },
        { id: 'a101-ys5', name: 'Havuç Paket 350 G', description: '350g taze havuç', price: 32.90, unit: 'paket', emoji: '🥕', popular: true },
        { id: 'a101-ys6', name: 'Kıvırcık Adet', description: 'Taze kıvırcık marul', price: 39.50, unit: 'adet', emoji: '🥬' },
        { id: 'a101-ys7', name: 'Taze Soğan Adet', description: 'Taze yeşil soğan', price: 49.50, unit: 'adet', emoji: '🌱' },
        { id: 'a101-ys8', name: 'Marul Göbek Adet', description: 'Göbek marul', price: 49.50, unit: 'adet', emoji: '🥬' },
        { id: 'a101-ys9', name: 'Marul Adet', description: 'Büyük boy marul', price: 54.90, unit: 'adet', emoji: '🥬', popular: true },
        { id: 'a101-ys10', name: 'Kırmızı Lahana Kg', description: 'Taze kırmızı lahana', price: 69.50, unit: 'kg', emoji: '🥬' },
      ],
    },
    {
      category: 'Et, Tavuk & Şarküteri',
      items: [
        { id: 'a101-et1', name: 'Dana Kıyma 500g', description: 'Taze çekilmiş dana', price: 285, unit: 'paket', emoji: '🥩', popular: true },
        { id: 'a101-et2', name: 'Tavuk Bütün ~1.5kg', description: 'Taze bütün piliç', price: 219, unit: 'adet', emoji: '🍗', popular: true },
        { id: 'a101-et3', name: 'Tavuk Göğsü 1kg', description: 'Taze piliç göğsü', price: 178, unit: 'kg', emoji: '🍗' },
        { id: 'a101-et4', name: 'Tavuk But 1kg', description: 'Taze piliç but', price: 158, unit: 'kg', emoji: '🍗' },
        { id: 'a101-et5', name: 'Dana Sucuk 250g', description: 'Cumhuriyet baton sucuk', price: 229, unit: 'paket', emoji: '🌭', popular: true },
        { id: 'a101-et6', name: 'Piliç Sosis 500g', description: 'Hazır piliç sosisi', price: 89, unit: 'paket', emoji: '🌭' },
        { id: 'a101-et7', name: 'Hindi Salam 150g', description: 'Dilimli hindi salam', price: 69, unit: 'paket', emoji: '🥓' },
        { id: 'a101-et8', name: 'Dana Kuşbaşı 400g', description: 'Taze dana kuşbaşı', price: 299, unit: 'paket', emoji: '🥩' },
        { id: 'a101-et9', name: 'Hazır Köfte 300g', description: 'Şekilli hazır köfte', price: 145, unit: 'paket', emoji: '🍖' },
      ],
    },
    {
      category: 'Süt Ürünleri, Kahvaltılık',
      items: [
        { id: 'a101-s1', name: 'Pınar Kaşar 400g', description: 'Dilimlenmiş taze kaşar', price: 175, unit: 'paket', emoji: '🧀', popular: true },
        { id: 'a101-s2', name: 'Beyaz Peynir 500g', description: 'Tam yağlı beyaz peynir', price: 139, unit: 'paket', emoji: '🧀' },
        { id: 'a101-s3', name: 'Sütaş Tereyağı 500g', description: 'Pastörize tereyağı', price: 259, unit: 'paket', emoji: '🧈' },
        { id: 'a101-s4', name: 'Yoğurt 1kg', description: 'Tam yağlı süzme yoğurt', price: 72, unit: 'kase', emoji: '🥛', popular: true },
        { id: 'a101-s5', name: 'Krem Peynir 180g', description: 'Sürülebilir krem peynir', price: 62, unit: 'kase', emoji: '🧀' },
        { id: 'a101-s6', name: 'Ayran 1L', description: 'İçim sütçüm ayran', price: 45, unit: 'şişe', emoji: '🥛' },
        { id: 'a101-s7', name: 'Yumurta 15\'li', description: 'L beden çiftlik yumurtası', price: 82, unit: 'koli', emoji: '🥚', popular: true },
        { id: 'a101-s8', name: 'Siyah Zeytin 250g', description: 'Salamura siyah zeytin', price: 62, unit: 'kase', emoji: '🫒' },
        { id: 'a101-s9', name: 'Yeşil Zeytin 250g', description: 'Salamura yeşil zeytin', price: 59, unit: 'kase', emoji: '🫒' },
        { id: 'a101-s10', name: 'Çilek Reçeli 380g', description: 'Ülker çilek reçeli', price: 79, unit: 'kavanoz', emoji: '🍓', popular: true },
        { id: 'a101-s11', name: 'Bal 460g', description: 'Doğal süzme çiçek balı', price: 195, unit: 'kavanoz', emoji: '🍯' },
        { id: 'a101-s12', name: 'Fındık Kreması 400g', description: 'Kakaolu fındık kreması', price: 195, unit: 'kavanoz', emoji: '🍫' },
        { id: 'a101-s13', name: 'Tahin Helvası 500g', description: 'Koska fıstıklı helva', price: 109, unit: 'kutu', emoji: '🍯' },
      ],
    },
    {
      category: 'Fırından',
      items: [
        { id: 'a101-f1', name: 'Ekmek Adet', description: 'Günlük taze ekmek', price: 17.50, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'a101-f2', name: 'Sandviç Ekmeği 8\'li', description: 'Tost & sandviç ekmeği', price: 68, unit: 'paket', emoji: '🥖' },
        { id: 'a101-f3', name: 'Hamburger Ekmeği 4\'lü', description: 'Susamlı hamburger ekmeği', price: 72, unit: 'paket', emoji: '🍔' },
        { id: 'a101-f4', name: 'Kepekli Ekmek 400g', description: 'Tam buğday kepekli', price: 36, unit: 'adet', emoji: '🍞' },
        { id: 'a101-f5', name: 'Sütlaç 240g', description: 'Hazır fırın sütlaç', price: 48, unit: 'adet', emoji: '🍮' },
        { id: 'a101-f6', name: 'Poğaça Adet', description: 'Peynirli veya zeytinli', price: 25, unit: 'adet', emoji: '🥐' },
      ],
    },
    {
      category: 'Temel Gıda',
      items: [
        { id: 'a101-tg1', name: 'Pirinç Baldo 1kg', description: 'Kalite A baldo pirinç', price: 92, unit: 'kg', emoji: '🌾', popular: true },
        { id: 'a101-tg2', name: 'Makarna 500g', description: 'Penne/spagetti', price: 42, unit: 'paket', emoji: '🍝' },
        { id: 'a101-tg3', name: 'Bulgur 1kg', description: 'Köy tipi köftelik bulgur', price: 45, unit: 'kg', emoji: '🌾' },
        { id: 'a101-tg4', name: 'Ayçiçek Yağı 2L', description: 'Tariş Gold rafine', price: 215, unit: 'şişe', emoji: '🌻', popular: true },
        { id: 'a101-tg5', name: 'Zeytinyağı 1L', description: 'Naturel sızma', price: 225, unit: 'şişe', emoji: '🫒' },
        { id: 'a101-tg6', name: 'Domates Salçası 830g', description: 'Tukaş domates salçası', price: 52, unit: 'teneke', emoji: '🍅' },
        { id: 'a101-tg7', name: 'Şeker 1kg', description: 'Kristal toz şeker', price: 55, unit: 'kg', emoji: '🍬' },
        { id: 'a101-tg8', name: 'Un 2kg', description: 'Birinci kalite buğday unu', price: 75, unit: 'paket', emoji: '🌾' },
        { id: 'a101-tg9', name: 'Ton Balığı 160g', description: 'Palmera zeytinyağlı', price: 72, unit: 'kutu', emoji: '🐟', popular: true },
        { id: 'a101-tg10', name: 'Nohut Konserve 400g', description: 'Haşlanmış hazır nohut', price: 38, unit: 'kutu', emoji: '🫘' },
        { id: 'a101-tg11', name: 'Kırmızı Fasulye 400g', description: 'Haşlanmış hazır fasulye', price: 35, unit: 'kutu', emoji: '🫘' },
        { id: 'a101-tg12', name: 'Mayonez 285g', description: 'Hellmann\'s gerçek', price: 55, unit: 'kavanoz', emoji: '🫙' },
        { id: 'a101-tg13', name: 'Ketçap 420g', description: 'Domates ketçap', price: 48, unit: 'şişe', emoji: '🍅' },
      ],
    },
    {
      category: 'Atıştırmalık',
      items: [
        { id: 'a101-a1', name: 'Lay\'s Fırın 130g', description: 'Fırınlanmış patates cipsi', price: 59, unit: 'paket', emoji: '🍟', popular: true },
        { id: 'a101-a2', name: 'Doritos 130g', description: 'Baharatlı mısır cipsi', price: 65, unit: 'paket', emoji: '🌽', popular: true },
        { id: 'a101-a3', name: 'Ülker Sütlü Çikolata 100g', description: 'Ülker sütlü tablet', price: 65, unit: 'adet', emoji: '🍫' },
        { id: 'a101-a4', name: 'Ülker Gofret 76g', description: 'Çikolata kaplı gofret', price: 30, unit: 'adet', emoji: '🍫' },
        { id: 'a101-a5', name: 'Fındık 150g', description: 'Kavrulmuş tuzlu iç fındık', price: 115, unit: 'paket', emoji: '🌰' },
        { id: 'a101-a6', name: 'Kuru Üzüm 250g', description: 'Sultani kuru üzüm', price: 62, unit: 'paket', emoji: '🍇' },
        { id: 'a101-a7', name: 'Eti Petit Bisküvi 200g', description: 'Çikolatalı bisküvi', price: 42, unit: 'paket', emoji: '🍪' },
        { id: 'a101-a8', name: 'Granola Bar 35g', description: 'Yulaflı tahıl bar', price: 30, unit: 'adet', emoji: '🌾' },
      ],
    },
    {
      category: 'Su & İçecek',
      items: [
        { id: 'a101-i1', name: 'Su 0.5L', description: 'Damla / Çamlıca', price: 7.90, unit: 'şişe', emoji: '💧', popular: true },
        { id: 'a101-i2', name: 'Su 1.5L', description: 'Kaynak suyu', price: 13.90, unit: 'şişe', emoji: '💧' },
        { id: 'a101-i3', name: 'Coca-Cola 2.5L', description: 'Pet şişe kola', price: 79, unit: 'şişe', emoji: '🥤', popular: true },
        { id: 'a101-i4', name: 'Sprite 2L', description: 'Pet şişe limonlu', price: 68, unit: 'şişe', emoji: '🥤' },
        { id: 'a101-i5', name: 'Fuse Tea Limon 1.5L', description: 'Limonlu soğuk çay', price: 52, unit: 'şişe', emoji: '🍵' },
        { id: 'a101-i6', name: 'Cappy Portakal 1L', description: 'Portakal meyve suyu', price: 55, unit: 'kutu', emoji: '🧃' },
        { id: 'a101-i7', name: 'Red Bull 250ml', description: 'Enerji içeceği', price: 72, unit: 'kutu', emoji: '⚡' },
        { id: 'a101-i8', name: 'Çay 1kg', description: 'Doğuş / Çaykur dökme', price: 195, unit: 'paket', emoji: '🍵', popular: true },
        { id: 'a101-i9', name: 'Türk Kahvesi 200g', description: 'Mehmet Efendi', price: 235, unit: 'paket', emoji: '☕' },
        { id: 'a101-i10', name: 'Nescafé 3\'ü 1 Arada 10\'lu', description: 'Hazır kahve', price: 109, unit: 'kutu', emoji: '☕' },
      ],
    },
    {
      category: 'Donuk, Hazır Yemek',
      items: [
        { id: 'a101-d1', name: 'Çubuk Patates 750g', description: 'Dondurulmuş çubuk patates', price: 99, unit: 'paket', emoji: '🍟', popular: true },
        { id: 'a101-d2', name: 'Karışık Sebze 1kg', description: 'Dondurulmuş sebze karışımı', price: 89, unit: 'paket', emoji: '🥦' },
        { id: 'a101-d3', name: 'Dondurulmuş Ispanak 450g', description: 'Hazır ıspanak', price: 58, unit: 'paket', emoji: '🥬' },
        { id: 'a101-d4', name: 'Mantı 450g', description: 'Dondurulmuş hazır mantı', price: 45, unit: 'paket', emoji: '🥟', popular: true },
        { id: 'a101-d5', name: 'Peynirli Börek 650g', description: 'Tepsi böreği dondurulmuş', price: 109, unit: 'paket', emoji: '🥧' },
        { id: 'a101-d6', name: 'Dondurulmuş Pizza', description: 'Dr. Oetker peynirli pizza', price: 145, unit: 'adet', emoji: '🍕' },
        { id: 'a101-d7', name: 'Hazır Rus Salatası 250g', description: 'Soğuk hazır salata', price: 35, unit: 'kase', emoji: '🥗' },
        { id: 'a101-d8', name: 'Hazır Sandviç 130g', description: 'Kaşar peynirli sandviç', price: 39, unit: 'adet', emoji: '🥪' },
      ],
    },
    {
      category: 'Dondurma',
      items: [
        { id: 'a101-don1', name: 'Algida Algida 850ml', description: 'Çikolata/vanilya dondurma', price: 145, unit: 'kutu', emoji: '🍨', popular: true },
        { id: 'a101-don2', name: 'Magnum Classic 100ml', description: 'Çikolata kaplı', price: 92, unit: 'adet', emoji: '🍦', popular: true },
        { id: 'a101-don3', name: 'Cornetto 150ml', description: 'Çikolatalı külah', price: 78, unit: 'adet', emoji: '🍦' },
        { id: 'a101-don4', name: 'Mini Dondurma 60ml', description: 'Çeşitli lezzetler', price: 19, unit: 'adet', emoji: '🍦' },
        { id: 'a101-don5', name: 'Dondurma 2L Aile Boy', description: 'Aile boyu çilek/vanilya', price: 175, unit: 'kova', emoji: '🍨' },
      ],
    },
    {
      category: 'Temizlik Ürünleri',
      items: [
        { id: 'a101-t1', name: 'Omo Toz Deterjan 3kg', description: 'Çamaşır toz deterjanı', price: 205, unit: 'paket', emoji: '🧺', popular: true },
        { id: 'a101-t2', name: 'Comfort Yumuşatıcı 1.5L', description: 'Çamaşır yumuşatıcısı', price: 99, unit: 'şişe', emoji: '🧴' },
        { id: 'a101-t3', name: 'Domestos 750ml', description: 'Çamaşır suyu temizleyici', price: 52, unit: 'şişe', emoji: '🧴' },
        { id: 'a101-t4', name: 'Fairy Bulaşık 750ml', description: 'Sıvı bulaşık deterjanı', price: 72, unit: 'şişe', emoji: '🍽️' },
        { id: 'a101-t5', name: 'Cif Krem 500ml', description: 'Yüzey temizleyici krem', price: 62, unit: 'şişe', emoji: '✨' },
        { id: 'a101-t6', name: 'Bulaşık Makinesi Tableti 40\'lı', description: 'Hepsi bir arada tablet', price: 155, unit: 'kutu', emoji: '🍽️' },
        { id: 'a101-t7', name: 'Çöp Torbası 10\'lu 40L', description: 'Orta boy çöp torbası', price: 30, unit: 'paket', emoji: '🗑️' },
      ],
    },
    {
      category: 'Kişisel Bakım',
      items: [
        { id: 'a101-kb1', name: 'Pantene Şampuan 400ml', description: 'Onarıcı güçlendirici', price: 145, unit: 'şişe', emoji: '🧴', popular: true },
        { id: 'a101-kb2', name: 'Head & Shoulders 400ml', description: 'Kepek önleyici', price: 148, unit: 'şişe', emoji: '🧴' },
        { id: 'a101-kb3', name: 'Colgate Diş Macunu 100ml', description: 'Max fresh nane', price: 58, unit: 'adet', emoji: '🪥' },
        { id: 'a101-kb4', name: 'Dove Sabun Adet', description: 'Nemlendirici krem sabun', price: 68, unit: 'adet', emoji: '🧼' },
        { id: 'a101-kb5', name: 'Rexona Deodorant 150ml', description: 'Anti-perspirant sprey', price: 92, unit: 'adet', emoji: '🌬️' },
        { id: 'a101-kb6', name: 'Nivea Vücut Losyonu 400ml', description: 'Nemlendirici krem', price: 135, unit: 'şişe', emoji: '🧴' },
        { id: 'a101-kb7', name: 'Gillette Tıraş Jeli 200ml', description: 'Hassas ciltler için', price: 95, unit: 'kutu', emoji: '🪒' },
      ],
    },
    {
      category: 'Kağıt Ürünleri',
      items: [
        { id: 'a101-kk1', name: 'Selpak Tuvalet Kağıdı 24\'lü', description: '3 katlı tuvalet kağıdı', price: 249, unit: 'paket', emoji: '🧻', popular: true },
        { id: 'a101-kk2', name: 'Selpak Kağıt Havlu 6\'lı', description: 'Çift katlı kağıt havlu', price: 99, unit: 'paket', emoji: '🧻' },
        { id: 'a101-kk3', name: 'Selpak Peçete 200\'lü', description: 'Beyaz kağıt peçete', price: 32, unit: 'paket', emoji: '🍽️' },
        { id: 'a101-kk4', name: 'Islak Mendil 90\'lı', description: 'Nemlendirici islak mendil', price: 42, unit: 'paket', emoji: '🤧' },
      ],
    },
    {
      category: 'Anne & Bebek',
      items: [
        { id: 'a101-bb1', name: 'Molfix Bezi M 36\'lı', description: 'Bebek bezi 3 numara', price: 179, unit: 'paket', emoji: '👶', popular: true },
        { id: 'a101-bb2', name: 'Molfix Bezi L 30\'lu', description: 'Bebek bezi 4 numara', price: 179, unit: 'paket', emoji: '👶' },
        { id: 'a101-bb3', name: 'Molfix Islak Mendil 90\'lı', description: 'Bebek ıslak mendili', price: 55, unit: 'paket', emoji: '🧻' },
        { id: 'a101-bb4', name: 'Nestle Bebek Maması 400g', description: 'Tahıllı bebek maması 4+ ay', price: 135, unit: 'kutu', emoji: '🍼' },
        { id: 'a101-bb5', name: 'Nestle Bebek Maması 125g', description: 'Kavanoz meyveli mama 6+ ay', price: 48, unit: 'kavanoz', emoji: '🍼' },
      ],
    },
  ],
};


// ─────────────────────────────────────────────────────────────────────────────
// ŞOK MARKET
// ─────────────────────────────────────────────────────────────────────────────

const SOK: Store = {
  id: 'sok',
  name: 'Şok Market',
  type: 'supermarket',
  emoji: '🏪',
  tagline: 'Şok fiyatlar, şok tasarruf!',
  rating: 4.0,
  logo: 'https://logo.clearbit.com/sokmarket.com.tr',
  bannerColor: '#8B0000',
  etaMin: 22,
  minOrder: 50,
  address: 'Gazipaşa Cad., Bartın Merkez',
  sections: [
    {
      category: 'Fırından Taze',
      items: [
        { id: 'sok-f1', name: 'Ekmek 300g', description: 'Günlük pide', price: 10, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'sok-f2', name: 'Açma', description: 'Tereyağlı', price: 22, unit: 'adet', emoji: '🥐' },
        { id: 'sok-f3', name: 'Börek 250g', description: 'Ispanaklı/peynirli', price: 65, unit: 'adet', emoji: '🥧', popular: true },
        { id: 'sok-f4', name: 'Poğaça 4\'lü', description: 'Zeytinli', price: 68, unit: 'paket', emoji: '🥐' },
        { id: 'sok-f5', name: 'Simid', description: 'Susamlı, taze', price: 10, unit: 'adet', emoji: '🥯' },
      ],
    },
    {
      category: 'Süt & Süt Ürünleri',
      items: [
        { id: 'sok-s1', name: 'Süt 1L', description: 'Sek tam yağlı', price: 30, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'sok-s2', name: 'Yoğurt 2kg', description: 'Köy tipi', price: 115, unit: 'kova', emoji: '🥛' },
        { id: 'sok-s3', name: 'Çökelek 400g', description: 'Taze lor', price: 68, unit: 'paket', emoji: '🧀' },
        { id: 'sok-s4', name: 'Ezine Peyniri 300g', description: 'Koyun sütünden', price: 145, unit: 'paket', emoji: '🧀', popular: true },
        { id: 'sok-s5', name: 'Ayran 330ml', description: 'Soğuk', price: 22, unit: 'kutu', emoji: '🥛' },
        { id: 'sok-s6', name: 'Tereyağı 200g', description: 'Doğal', price: 108, unit: 'paket', emoji: '🧈' },
      ],
    },
    {
      category: 'Et & Şarküteri',
      items: [
        { id: 'sok-et1', name: 'Sucuk 250g', description: 'Acılı', price: 105, unit: 'paket', emoji: '🌭', popular: true },
        { id: 'sok-et2', name: 'Sosis 200g', description: 'Dana', price: 78, unit: 'paket', emoji: '🌭' },
        { id: 'sok-et3', name: 'Tavuk Göğsü 1kg', description: 'Dondurulmuş', price: 162, unit: 'kg', emoji: '🍗', popular: true },
        { id: 'sok-et4', name: 'Köfte 500g', description: 'Dondurulmuş hazır', price: 118, unit: 'paket', emoji: '🍖' },
      ],
    },
    {
      category: 'Temel Gıda',
      items: [
        { id: 'sok-tg1', name: 'Pirinç 1kg', description: 'Baldo', price: 80, unit: 'kg', emoji: '🌾', popular: true },
        { id: 'sok-tg2', name: 'Makarna 500g', description: 'Spagetti', price: 30, unit: 'paket', emoji: '🍝' },
        { id: 'sok-tg3', name: 'Nohut 1kg', description: 'Kuru', price: 85, unit: 'kg', emoji: '🫘' },
        { id: 'sok-tg4', name: 'Mercimek 1kg', description: 'Kırmızı', price: 80, unit: 'kg', emoji: '🫘' },
        { id: 'sok-tg5', name: 'Ayçiçek Yağı 1L', description: 'Rafine', price: 52, unit: 'şişe', emoji: '🌻' },
        { id: 'sok-tg6', name: 'Salça 700g', description: 'Domates', price: 62, unit: 'teneke', emoji: '🍅' },
        { id: 'sok-tg7', name: 'Tuz 750g', description: 'İyotlu', price: 16, unit: 'paket', emoji: '🧂' },
        { id: 'sok-tg8', name: 'Şeker 1kg', description: 'Toz', price: 48, unit: 'kg', emoji: '🍬' },
      ],
    },
    {
      category: 'Hazır Yemek & Konserve',
      items: [
        { id: 'sok-hy1', name: 'Kısır 400g', description: 'Hazır servis', price: 48, unit: 'kase', emoji: '🥗' },
        { id: 'sok-hy2', name: 'Mercimek Çorbası 400g', description: 'Konserve', price: 42, unit: 'kutu', emoji: '🍲', popular: true },
        { id: 'sok-hy3', name: 'Fasulye Pilaki 400g', description: 'Konserve', price: 38, unit: 'kutu', emoji: '🫘' },
        { id: 'sok-hy4', name: 'Ton Balığı 160g', description: 'Suyu içinde', price: 65, unit: 'kutu', emoji: '🐟', popular: true },
        { id: 'sok-hy5', name: 'Mısır Konservesi 285g', description: 'Tatlı', price: 28, unit: 'kutu', emoji: '🌽' },
        { id: 'sok-hy6', name: 'Domates Konservesi 400g', description: 'Doğranmış', price: 32, unit: 'kutu', emoji: '🍅' },
        { id: 'sok-hy7', name: 'Bamya Konservesi 400g', description: 'Salamura', price: 30, unit: 'kutu', emoji: '🥬' },
      ],
    },
    {
      category: 'Meyve & Sebze',
      items: [
        { id: 'sok-mv1', name: 'Domates 1kg', description: 'Taze', price: 35, unit: 'kg', emoji: '🍅', popular: true },
        { id: 'sok-mv2', name: 'Patates 2.5kg', description: 'Yerli', price: 75, unit: 'torba', emoji: '🥔', popular: true },
        { id: 'sok-mv3', name: 'Soğan 2.5kg', description: 'Kuru', price: 55, unit: 'torba', emoji: '🧅' },
        { id: 'sok-mv4', name: 'Elma 1kg', description: 'Fuji', price: 40, unit: 'kg', emoji: '🍎' },
        { id: 'sok-mv5', name: 'Muz 1kg', description: 'Olgun', price: 55, unit: 'kg', emoji: '🍌' },
        { id: 'sok-mv6', name: 'Portakal 1kg', description: 'Washington', price: 38, unit: 'kg', emoji: '🍊' },
      ],
    },
    {
      category: 'Atıştırmalık',
      items: [
        { id: 'sok-at1', name: 'Cips 125g', description: 'Çeşitli tatlar', price: 50, unit: 'paket', emoji: '🍟', popular: true },
        { id: 'sok-at2', name: 'Çikolata 80g', description: 'Sütlü/bitter', price: 52, unit: 'adet', emoji: '🍫', popular: true },
        { id: 'sok-at3', name: 'Gofret 40g', description: 'Çikolatalı', price: 22, unit: 'adet', emoji: '🍫' },
        { id: 'sok-at4', name: 'Bisküvi 150g', description: 'Muzlu/çikolatalı', price: 30, unit: 'paket', emoji: '🍪' },
        { id: 'sok-at5', name: 'Leblebi 200g', description: 'Sarı', price: 35, unit: 'paket', emoji: '🌰' },
        { id: 'sok-at6', name: 'Fındıklı Lokum 250g', description: 'Türk lokumu', price: 55, unit: 'kutu', emoji: '🍬', popular: true },
      ],
    },
    {
      category: 'İçecek & Kahve',
      items: [
        { id: 'sok-i1', name: 'Su 0.5L 6\'lı', description: 'Damla', price: 55, unit: 'paket', emoji: '💧', popular: true },
        { id: 'sok-i2', name: 'Türk Kahvesi 100g', description: 'Mehmet Efendi', price: 125, unit: 'paket', emoji: '☕', popular: true },
        { id: 'sok-i3', name: 'Nescafe 3\'ü 1 10\'lu', description: 'Classic', price: 88, unit: 'kutu', emoji: '☕' },
        { id: 'sok-i4', name: 'Çay 200g', description: 'Çaykur Rize', price: 48, unit: 'paket', emoji: '🍵', popular: true },
        { id: 'sok-i5', name: 'Limonata 1L', description: 'Uludağ', price: 42, unit: 'şişe', emoji: '🍋' },
        { id: 'sok-i6', name: 'Enerji İçeceği 250ml', description: 'Monster', price: 62, unit: 'kutu', emoji: '⚡' },
        { id: 'sok-i7', name: 'Kola 1L', description: 'Coca-Cola', price: 48, unit: 'şişe', emoji: '🥤' },
      ],
    },
    {
      category: 'Temizlik & Bakım',
      items: [
        { id: 'sok-k1', name: 'Deterjan 2kg', description: 'Omo', price: 145, unit: 'paket', emoji: '🧺', popular: true },
        { id: 'sok-k2', name: 'Çamaşır Suyu 1L', description: 'Domestos', price: 42, unit: 'şişe', emoji: '🧴' },
        { id: 'sok-k3', name: 'Bulaşık Deterjanı 750ml', description: 'Pril', price: 52, unit: 'şişe', emoji: '🧴' },
        { id: 'sok-k4', name: 'Tuvalet Kağıdı 16\'lı', description: 'Selpak', price: 158, unit: 'paket', emoji: '🧻', popular: true },
        { id: 'sok-k5', name: 'Çöp Torbası 10\'lu', description: '25L', price: 22, unit: 'paket', emoji: '🗑️' },
        { id: 'sok-k6', name: 'Sabun 4\'lü', description: 'Dove/Palmolive', price: 52, unit: 'paket', emoji: '🧼' },
        { id: 'sok-k7', name: 'Diş Macunu 75ml', description: 'Signal', price: 45, unit: 'adet', emoji: '🪥' },
      ],
    },
    {
      category: 'Bebek Ürünleri',
      items: [
        { id: 'sok-bb1', name: 'Bebek Bezi M 36\'lı', description: 'Evy Baby', price: 148, unit: 'paket', emoji: '👶', popular: true },
        { id: 'sok-bb2', name: 'Islak Mendil 90\'lı', description: 'Bebek', price: 48, unit: 'paket', emoji: '🧻' },
        { id: 'sok-bb3', name: 'Bebek Losyonu 200ml', description: 'Johnson\'s', price: 68, unit: 'şişe', emoji: '🧴' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MİGROS
// ─────────────────────────────────────────────────────────────────────────────

const MIGROS_CUMHURIYET: Store = {
  id: 'migros-cumhuriyet',
  name: 'Migros',
  type: 'supermarket',
  emoji: '🏬',
  tagline: 'Geniş ürün yelpazesi · Cumhuriyet Şb.',
  rating: 4.4,
  etaMin: 25,
  logo: '/logos/migros.svg',
  bannerColor: '#E8621A',
  minOrder: 75,
  address: 'Bartın-Zonguldak Yolu, Cumhuriyet Mah., Bartın',
  openingHours: 'Mo-Su 09:00-22:00',
  sections: [
    {
      category: 'Organik & Premium Ürünler',
      items: [
        { id: 'mgr-o1', name: 'Organik Süt 1L', description: 'Sertifikalı organik', price: 58, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'mgr-o2', name: 'Organik Yumurta 12\'li', description: 'Serbest dolaşımlı', price: 95, unit: 'koli', emoji: '🥚', popular: true },
        { id: 'mgr-o3', name: 'Organik Zeytinyağı 500ml', description: 'Soğuk sıkım', price: 248, unit: 'şişe', emoji: '🫒' },
        { id: 'mgr-o4', name: 'Badem Ezmesi 200g', description: 'Şekersiz, doğal', price: 145, unit: 'kavanoz', emoji: '🌰' },
        { id: 'mgr-o5', name: 'Chia Tohumu 200g', description: 'Organik', price: 88, unit: 'paket', emoji: '🌱' },
      ],
    },
    {
      category: 'Süt & Süt Ürünleri',
      items: [
        { id: 'mgr-s1', name: 'Süt 2L', description: 'Sütaş tam yağlı', price: 65, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'mgr-s2', name: 'Yoğurt 1kg', description: 'Sütaş süzme', price: 75, unit: 'kase', emoji: '🥛' },
        { id: 'mgr-s3', name: 'Parmesan 100g', description: 'İtalyan rendeli', price: 188, unit: 'paket', emoji: '🧀' },
        { id: 'mgr-s4', name: 'Mozzarella 125g', description: 'Taze top', price: 98, unit: 'adet', emoji: '🧀', popular: true },
        { id: 'mgr-s5', name: 'Kaşar Peyniri 600g', description: 'Pınar kalın dilim', price: 245, unit: 'paket', emoji: '🧀' },
        { id: 'mgr-s6', name: 'Mascarpone 250g', description: 'İtalyan kreması', price: 145, unit: 'kase', emoji: '🧀' },
        { id: 'mgr-s7', name: 'Dondurma 2L', description: 'Algida Magnum tarzı', price: 198, unit: 'kutu', emoji: '🍦' },
      ],
    },
    {
      category: 'Et & Deli Counter',
      items: [
        { id: 'mgr-et1', name: 'Dana Antrikot 500g', description: 'Taze, izgaralık', price: 318, unit: 'paket', emoji: '🥩', popular: true },
        { id: 'mgr-et2', name: 'Dana Bonfile 500g', description: 'Premium kesim', price: 398, unit: 'paket', emoji: '🥩' },
        { id: 'mgr-et3', name: 'Tavuk Göğsü Marine 1kg', description: 'Baharatlı hazır', price: 195, unit: 'paket', emoji: '🍗', popular: true },
        { id: 'mgr-et4', name: 'Kuzu Pirzola 500g', description: 'Izgara için', price: 365, unit: 'paket', emoji: '🍖' },
        { id: 'mgr-et5', name: 'Somon Fileto 300g', description: 'Norveç', price: 285, unit: 'paket', emoji: '🐟', popular: true },
        { id: 'mgr-et6', name: 'Füme Somon 100g', description: 'Dilimli', price: 198, unit: 'paket', emoji: '🐟' },
      ],
    },
    {
      category: 'Şarap & Alkollü İçecekler',
      items: [
        { id: 'mgr-alc1', name: 'Kırmızı Şarap 750ml', description: 'Yakut Kavaklıdere', price: 285, unit: 'şişe', emoji: '🍷', popular: true },
        { id: 'mgr-alc2', name: 'Beyaz Şarap 750ml', description: 'Suvla', price: 268, unit: 'şişe', emoji: '🍾' },
        { id: 'mgr-alc3', name: 'Bira 500ml', description: 'Efes Pilsen', price: 68, unit: 'kutu', emoji: '🍺', popular: true },
        { id: 'mgr-alc4', name: 'Bira 6\'lı 330ml', description: 'Miller/Heineken', price: 285, unit: 'paket', emoji: '🍺' },
      ],
    },
    {
      category: 'Uluslararası Ürünler',
      items: [
        { id: 'mgr-u1', name: 'Soya Sosu 150ml', description: 'Kikkoman', price: 88, unit: 'şişe', emoji: '🍶' },
        { id: 'mgr-u2', name: 'Sriracha 435ml', description: 'Acı sos', price: 105, unit: 'şişe', emoji: '🌶️', popular: true },
        { id: 'mgr-u3', name: 'Pesto 190g', description: 'Yeşil fesleğenli', price: 128, unit: 'kavanoz', emoji: '🫙' },
        { id: 'mgr-u4', name: 'Tahini 300g', description: 'Saf', price: 95, unit: 'kavanoz', emoji: '🫙' },
        { id: 'mgr-u5', name: 'Humus 200g', description: 'Hazır', price: 78, unit: 'kase', emoji: '🫘', popular: true },
        { id: 'mgr-u6', name: 'Japon Eriştesi 200g', description: 'Ramen', price: 65, unit: 'paket', emoji: '🍜' },
      ],
    },
    {
      category: 'Taze Meyve & Sebze',
      items: [
        { id: 'mgr-mv1', name: 'Cherry Domates 250g', description: 'Kiraz domates', price: 42, unit: 'paket', emoji: '🍅', popular: true },
        { id: 'mgr-mv2', name: 'Avokado', description: 'Olgun, büyük', price: 55, unit: 'adet', emoji: '🥑', popular: true },
        { id: 'mgr-mv3', name: 'Brokoli', description: 'Taze, büyük', price: 38, unit: 'adet', emoji: '🥦' },
        { id: 'mgr-mv4', name: 'Mango', description: 'Olgun', price: 68, unit: 'adet', emoji: '🥭' },
        { id: 'mgr-mv5', name: 'Karpuz ~5kg', description: 'Yerli', price: 95, unit: 'adet', emoji: '🍉' },
        { id: 'mgr-mv6', name: 'Üzüm 1kg', description: 'Çekirdeksiz', price: 65, unit: 'kg', emoji: '🍇' },
      ],
    },
    {
      category: 'İçecek & İthal',
      items: [
        { id: 'mgr-i1', name: 'San Pellegrino 750ml', description: 'Maden suyu', price: 58, unit: 'şişe', emoji: '💧', popular: true },
        { id: 'mgr-i2', name: 'Lipton Ice Tea 1.5L', description: 'Şeftali', price: 55, unit: 'şişe', emoji: '🍵' },
        { id: 'mgr-i3', name: 'Starbucks Frapp. 250ml', description: 'Mocha/Vanilla', price: 95, unit: 'kutu', emoji: '☕', popular: true },
        { id: 'mgr-i4', name: 'Granini Meyve Suyu 1L', description: 'Alman, %100 meyve', price: 88, unit: 'kutu', emoji: '🧃' },
        { id: 'mgr-i5', name: 'Vitamin Water 500ml', description: 'Glazer', price: 42, unit: 'şişe', emoji: '💧' },
      ],
    },
    {
      category: 'Temizlik & Ev',
      items: [
        { id: 'mgr-k1', name: 'Ariel Pods 30\'lu', description: 'Sıvı kapsül', price: 298, unit: 'kutu', emoji: '🧺', popular: true },
        { id: 'mgr-k2', name: 'Comfort Black 1.5L', description: 'Yumuşatıcı', price: 112, unit: 'şişe', emoji: '🧴' },
        { id: 'mgr-k3', name: 'Flash Yüzey Sprey', description: 'Mutfak temizleyici', price: 68, unit: 'şişe', emoji: '🧹' },
        { id: 'mgr-k4', name: 'Tuvalet Kağıdı 32\'li', description: 'Selpak', price: 295, unit: 'paket', emoji: '🧻', popular: true },
      ],
    },
  ],
};

const MIGROS_KEMERKOPRU: Store = { ...MIGROS_CUMHURIYET, id: 'migros-kemerkopru', address: 'D010 Cad., Kemer Köprü, Bartın', tagline: 'Geniş ürün yelpazesi · Kemer Köprü Şb.' };

// ─────────────────────────────────────────────────────────────────────────────
// RESTAURANTS
// ─────────────────────────────────────────────────────────────────────────────

const BALIK_EVI: Store = {
  id: 'balik-evi',
  name: 'Bartın Balık Evi',
  type: 'restaurant',
  emoji: '🐟',
  tagline: 'Karadeniz\'in taze balığı · Günlük avlanan',
  bannerColor: '#1565C0',
  rating: 4.7,
  etaMin: 30,
  minOrder: 100,
  address: 'Bartın Nehri kıyısı, Merkez',
  sections: [
    {
      category: 'Taze Balık',
      items: [
        { id: 'bk-1', name: 'Hamsi Tava', description: 'Mısır unuyla kızartılmış, Karadeniz vazgeçilmezi', price: 155, unit: 'porsiyon', emoji: '🐟', popular: true },
        { id: 'bk-2', name: 'İstavrit Tava', description: 'Çıtır kızartma, limonlu', price: 145, unit: 'porsiyon', emoji: '🐟' },
        { id: 'bk-3', name: 'Lüfer Izgara', description: 'Büyük boy, ızgarada', price: 295, unit: 'porsiyon', emoji: '🐠', popular: true },
        { id: 'bk-4', name: 'Çipura Izgara', description: 'Orta boy, zeytinyağlı', price: 275, unit: 'porsiyon', emoji: '🐠' },
        { id: 'bk-5', name: 'Levrek Buğulama', description: 'Sebzeli, hafif pişmiş', price: 285, unit: 'porsiyon', emoji: '🐠' },
        { id: 'bk-6', name: 'Palamut Tava', description: 'Mısır unlu, Karadeniz usulü', price: 175, unit: 'porsiyon', emoji: '🐟' },
        { id: 'bk-7', name: 'Barbun Tava', description: 'Küçük ama lezzetli', price: 165, unit: 'porsiyon', emoji: '🐟' },
      ],
    },
    {
      category: 'Deniz Ürünleri',
      items: [
        { id: 'bk-8', name: 'Midye Dolma (6 adet)', description: 'Baharatlı pilavlı midye', price: 95, unit: 'tabak', emoji: '🦪', popular: true },
        { id: 'bk-9', name: 'Karides Güveç', description: 'Domates soslu, közlenmiş', price: 225, unit: 'güveç', emoji: '🦐', popular: true },
        { id: 'bk-10', name: 'Ahtapot Izgara', description: 'Marine edilmiş', price: 265, unit: 'porsiyon', emoji: '🐙' },
        { id: 'bk-11', name: 'Kalamar Tava', description: 'Çıtır, limonlu', price: 195, unit: 'porsiyon', emoji: '🦑' },
        { id: 'bk-12', name: 'Deniz Ürünleri Tabağı', description: 'Karışık: karides, midye, kalamar', price: 385, unit: 'tabak', emoji: '🦐' },
      ],
    },
    {
      category: 'Mezeler & Çorbalar',
      items: [
        { id: 'bk-m1', name: 'Balık Çorbası', description: 'Günlük taze', price: 68, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'bk-m2', name: 'Cacık', description: 'Soğuk, nane aromalı', price: 45, unit: 'kase', emoji: '🥒' },
        { id: 'bk-m3', name: 'Haydari', description: 'Yoğurtlu, sarımsaklı', price: 48, unit: 'kase', emoji: '🧄' },
        { id: 'bk-m4', name: 'Çoban Salatası', description: 'Domates, salatalık, biber', price: 55, unit: 'tabak', emoji: '🥗' },
        { id: 'bk-m5', name: 'Pilav', description: 'Tereyağlı şehriyeli', price: 48, unit: 'tabak', emoji: '🍚' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'bk-ic1', name: 'Ayran', description: 'Ev yapımı', price: 30, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'bk-ic2', name: 'Çay', description: 'Rize çayı', price: 18, unit: 'bardak', emoji: '🍵' },
        { id: 'bk-ic3', name: 'Su 500ml', description: 'Soğuk', price: 15, unit: 'şişe', emoji: '💧' },
        { id: 'bk-ic4', name: 'Kola', description: '330ml kutu', price: 45, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const KEBAPCI: Store = {
  id: 'kebapci',
  name: 'Urfa Ocakbaşı',
  type: 'restaurant',
  emoji: '🥩',
  tagline: 'Mangal ateşinde gerçek kebap lezzeti',
  rating: 4.5,
  etaMin: 25,
  minOrder: 80,
  address: 'Bartın Merkez',
  phone: '+90 378 228 00 15',
  openingHours: 'Mo-Su 09:00-02:00',
  sections: [
    {
      category: 'Kebaplar',
      items: [
        { id: 'kbp-1', name: 'Adana Kebap', description: 'Acılı dana kıyma, mangalda', price: 215, unit: 'porsiyon', emoji: '🥩', popular: true },
        { id: 'kbp-2', name: 'Urfa Kebap', description: 'Sade dana kıyma, acısız', price: 205, unit: 'porsiyon', emoji: '🥩' },
        { id: 'kbp-3', name: 'Şiş Kebap', description: 'Dana kuşbaşı, közlenmiş biber ile', price: 225, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'kbp-4', name: 'Tavuk Şiş', description: 'Marine edilmiş, ızgarada', price: 185, unit: 'porsiyon', emoji: '🍗' },
        { id: 'kbp-5', name: 'İskender Kebap', description: 'Döner üzeri, domates sos, yoğurt, tereyağı', price: 255, unit: 'porsiyon', emoji: '🥩', popular: true },
        { id: 'kbp-6', name: 'Karışık Izgara', description: 'Adana+Şiş+Tavuk, yanında salata', price: 385, unit: 'porsiyon', emoji: '🍢' },
        { id: 'kbp-7', name: 'Kanat Izgara', description: '8 adet, baharatlı', price: 165, unit: 'porsiyon', emoji: '🍗', popular: true },
      ],
    },
    {
      category: 'Pide & Lahmacun',
      items: [
        { id: 'kbp-p1', name: 'Kıymalı Pide', description: 'Fırın pide, kıymalı', price: 135, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'kbp-p2', name: 'Kaşarlı Pide', description: 'Eritilmiş kaşar peyniri', price: 125, unit: 'adet', emoji: '🫓' },
        { id: 'kbp-p3', name: 'Karışık Pide', description: 'Kıyma, yumurta, kaşar', price: 158, unit: 'adet', emoji: '🫓' },
        { id: 'kbp-p4', name: 'Lahmacun', description: 'İnce hamur, baharatlı kıyma', price: 68, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'kbp-p5', name: 'Lahmacun Dürüm', description: 'Salatalı, limonlu sarma', price: 88, unit: 'adet', emoji: '🌯' },
      ],
    },
    {
      category: 'Çorbalar & Mezeler',
      items: [
        { id: 'kbp-m1', name: 'Mercimek Çorbası', description: 'Tereyağlı, limonlu', price: 58, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'kbp-m2', name: 'Ezogelin Çorbası', description: 'Baharatlı', price: 58, unit: 'kase', emoji: '🍲' },
        { id: 'kbp-m3', name: 'Cacık', description: 'Soğuk', price: 45, unit: 'kase', emoji: '🥒' },
        { id: 'kbp-m4', name: 'Pilav', description: 'Tereyağlı', price: 48, unit: 'tabak', emoji: '🍚' },
        { id: 'kbp-m5', name: 'Domates Çorbası', description: 'Kremalı', price: 55, unit: 'kase', emoji: '🍅' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'kbp-ic1', name: 'Ayran', description: '300ml', price: 28, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'kbp-ic2', name: 'Şalgam', description: 'Acılı/Sade', price: 32, unit: 'bardak', emoji: '🫗' },
        { id: 'kbp-ic3', name: 'Çay', description: 'Bardak', price: 18, unit: 'bardak', emoji: '🍵' },
        { id: 'kbp-ic4', name: 'Kola 330ml', description: 'Soğuk kutu', price: 42, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const PIDE_EVI: Store = {
  id: 'pide-evi',
  name: 'Koza Pide',
  type: 'restaurant',
  emoji: '🫓',
  tagline: 'Taş fırında pide · Ev yapımı lezzetler',
  rating: 4.4,
  etaMin: 20,
  minOrder: 60,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 10:00-23:30',
  sections: [
    {
      category: 'Pideler',
      items: [
        { id: 'pd-1', name: 'Karadeniz Pidesi', description: 'Kuymak peynirli, tereyağlı', price: 148, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'pd-2', name: 'Yumurtalı Pide', description: 'Tam yumurtalı, peynirli', price: 135, unit: 'adet', emoji: '🫓' },
        { id: 'pd-3', name: 'Kuşbaşılı Pide', description: 'Dana kuşbaşı etli', price: 168, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'pd-4', name: 'Sucuklu Pide', description: 'Sucuk + yumurta', price: 142, unit: 'adet', emoji: '🫓' },
        { id: 'pd-5', name: 'Ispanaklı Pide', description: 'Ispanak + beyaz peynir', price: 128, unit: 'adet', emoji: '🫓' },
      ],
    },
    {
      category: 'Kahvaltı',
      items: [
        { id: 'pd-kh1', name: 'Serpme Kahvaltı', description: 'Peynir, zeytin, domates, yumurta, bal, reçel, çay dahil (2 kişilik)', price: 485, unit: 'set', emoji: '🍳', popular: true },
        { id: 'pd-kh2', name: 'Menemen', description: 'Domates, biber, yumurta', price: 95, unit: 'porsiyon', emoji: '🍳', popular: true },
        { id: 'pd-kh3', name: 'Sahanda Yumurta', description: 'Tereyağında', price: 78, unit: 'porsiyon', emoji: '🍳' },
        { id: 'pd-kh4', name: 'Sucuklu Yumurta', description: 'Tavada', price: 105, unit: 'porsiyon', emoji: '🍳' },
        { id: 'pd-kh5', name: 'Kaymak & Bal', description: 'Manda kaymağı + çiçek balı', price: 95, unit: 'porsiyon', emoji: '🍯' },
      ],
    },
    {
      category: 'Çay & İçecek',
      items: [
        { id: 'pd-ic1', name: 'Çay (Çaydanlık)', description: 'Rize çayı, 4-6 bardak', price: 55, unit: 'çaydanlık', emoji: '🍵', popular: true },
        { id: 'pd-ic2', name: 'Türk Kahvesi', description: 'Orta şekerli/sade', price: 68, unit: 'fincan', emoji: '☕' },
        { id: 'pd-ic3', name: 'Taze Sıkma OJ', description: 'Portakal suyu', price: 55, unit: 'bardak', emoji: '🍊' },
        { id: 'pd-ic4', name: 'Ayran', description: 'Soğuk', price: 28, unit: 'bardak', emoji: '🥛' },
      ],
    },
  ],
};

const DONER_EVI: Store = {
  id: 'doner-evi',
  name: 'Döner Evi',
  type: 'restaurant',
  emoji: '🌯',
  tagline: 'Çıtır ekme döner · Hızlı ve lezzetli',
  rating: 4.3,
  etaMin: 15,
  minOrder: 60,
  address: 'Pazar Cad. No:22, Bartın',
  sections: [
    {
      category: 'Döner Çeşitleri',
      items: [
        { id: 'dn-1', name: 'Tavuk Döner Dürüm', description: 'Lavaşta, kaşarlı, soslu', price: 95, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'dn-2', name: 'Et Döner Dürüm', description: 'Dana döner, lavaşta', price: 115, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'dn-3', name: 'Karışık Döner Dürüm', description: 'Tavuk+et karışık', price: 125, unit: 'adet', emoji: '🌯' },
        { id: 'dn-4', name: 'Tavuk Döner Ekmek', description: 'Yarım somun, salatası ile', price: 85, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'dn-5', name: 'Et Döner Ekmek', description: 'Yarım somun', price: 105, unit: 'adet', emoji: '🥙' },
        { id: 'dn-6', name: 'Döner Tabak', description: 'Pilav + salata + ayran', price: 175, unit: 'tabak', emoji: '🥩', popular: true },
        { id: 'dn-7', name: 'Çocuk Döner', description: 'Küçük ekmek, az malzeme', price: 65, unit: 'adet', emoji: '🥙' },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: 'dn-y1', name: 'Patates Kızartması', description: 'Çıtır, büyük boy', price: 62, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'dn-y2', name: 'Soğan Halkası', description: '10 adet, çıtır', price: 55, unit: 'porsiyon', emoji: '🧅' },
        { id: 'dn-y3', name: 'Pilav', description: 'Tereyağlı', price: 45, unit: 'tabak', emoji: '🍚' },
        { id: 'dn-y4', name: 'Çoban Salata', description: 'Taze', price: 45, unit: 'kase', emoji: '🥗' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'dn-i1', name: 'Ayran', description: 'Soğuk', price: 25, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'dn-i2', name: 'Şalgam', description: 'Acılı', price: 28, unit: 'bardak', emoji: '🫗' },
        { id: 'dn-i3', name: 'Kola 330ml', description: 'Soğuk', price: 38, unit: 'kutu', emoji: '🥤' },
        { id: 'dn-i4', name: 'Su', description: '500ml', price: 12, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const CORBA_EVI: Store = {
  id: 'corba-evi',
  name: 'Bartın Çorba Evi',
  type: 'restaurant',
  emoji: '🍲',
  tagline: '7/24 sıcak çorba · Geleneksel lezzetler',
  rating: 4.6,
  etaMin: 20,
  minOrder: 50,
  address: 'Belediye Yanı, Bartın',
  sections: [
    {
      category: 'Çorbalar',
      items: [
        { id: 'cb-1', name: 'Mercimek Çorbası', description: 'Tereyağlı, limonlu, kıtır ekmekli', price: 65, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'cb-2', name: 'Ezogelin Çorbası', description: 'Pul biberli, nefis', price: 65, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'cb-3', name: 'İşkembe Çorbası', description: 'Sarımsaklı, sirkeli', price: 78, unit: 'kase', emoji: '🍲' },
        { id: 'cb-4', name: 'Domates Çorbası', description: 'Kremalı veya sade', price: 60, unit: 'kase', emoji: '🍅' },
        { id: 'cb-5', name: 'Yayla Çorbası', description: 'Yoğurtlu, nane aromalı', price: 65, unit: 'kase', emoji: '🍲' },
        { id: 'cb-6', name: 'Balık Çorbası', description: 'Taze günlük', price: 80, unit: 'kase', emoji: '🐟', popular: true },
        { id: 'cb-7', name: 'Tavuk Çorbası', description: 'Ev yapımı şehriyeli', price: 68, unit: 'kase', emoji: '🍗' },
        { id: 'cb-8', name: 'Beyin Çorbası', description: 'Sarımsaklı limonlu', price: 85, unit: 'kase', emoji: '🍲' },
      ],
    },
    {
      category: 'Yanlar & Atıştırmalık',
      items: [
        { id: 'cb-y1', name: 'Ekmek', description: 'Taze pide', price: 10, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'cb-y2', name: 'Simit', description: 'Susamlı', price: 10, unit: 'adet', emoji: '🥯' },
        { id: 'cb-y3', name: 'Poğaça', description: 'Peynirli', price: 20, unit: 'adet', emoji: '🥐' },
        { id: 'cb-y4', name: 'Börek Dilim', description: 'Ispanaklı', price: 35, unit: 'dilim', emoji: '🥧' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'cb-i1', name: 'Çay', description: 'Rize', price: 15, unit: 'bardak', emoji: '🍵', popular: true },
        { id: 'cb-i2', name: 'Ayran', description: '300ml', price: 25, unit: 'bardak', emoji: '🥛' },
        { id: 'cb-i3', name: 'Su', description: '500ml', price: 12, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const PASTANE: Store = {
  id: 'pastane',
  name: 'Bartın Pastanesi',
  type: 'cafe',
  emoji: '🎂',
  tagline: 'Taze pasta, börek & kafe ☕',
  rating: 4.6,
  etaMin: 15,
  minOrder: 40,
  address: 'Atatürk Bulvarı, Bartın',
  sections: [
    {
      category: 'Pastalar & Tatlılar',
      items: [
        { id: 'ps-1', name: 'Profiterol', description: 'Çikolata soslu, kremalı', price: 88, unit: 'porsiyon', emoji: '🍮', popular: true },
        { id: 'ps-2', name: 'Tiramisu', description: 'İtalyan usulü', price: 95, unit: 'porsiyon', emoji: '🍰' },
        { id: 'ps-3', name: 'Cheesecake', description: 'Çilekli', price: 92, unit: 'dilim', emoji: '🍰', popular: true },
        { id: 'ps-4', name: 'Baklava (4 dilim)', description: 'Antep fıstıklı', price: 145, unit: 'kutu', emoji: '🍮', popular: true },
        { id: 'ps-5', name: 'Sütlaç', description: 'Fırında üstü kızarmış', price: 65, unit: 'kase', emoji: '🍮' },
        { id: 'ps-6', name: 'Kazandibi', description: 'Geleneksel', price: 58, unit: 'dilim', emoji: '🍮' },
        { id: 'ps-7', name: 'Waffle', description: 'Nutella + muz + dondurma', price: 115, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'ps-8', name: 'Pasta Dilimi', description: 'Günlük seçim, çikolatalı/meyveli', price: 78, unit: 'dilim', emoji: '🍰', popular: true },
      ],
    },
    {
      category: 'Börek & Tuzlular',
      items: [
        { id: 'ps-b1', name: 'Su Böreği (4 dilim)', description: 'Peynirli veya kıymalı', price: 95, unit: 'kutu', emoji: '🥧', popular: true },
        { id: 'ps-b2', name: 'Sigara Böreği (5 adet)', description: 'Peynirli', price: 65, unit: 'tabak', emoji: '🥟' },
        { id: 'ps-b3', name: 'Poğaça', description: 'Zeytinli/peynirli', price: 22, unit: 'adet', emoji: '🥐' },
        { id: 'ps-b4', name: 'Simit', description: 'Taze, susamlı', price: 12, unit: 'adet', emoji: '🥯' },
        { id: 'ps-b5', name: 'Tost', description: 'Kaşar + domates + sucuk', price: 85, unit: 'adet', emoji: '🥪', popular: true },
      ],
    },
    {
      category: 'Kahve & Sıcak İçecek',
      items: [
        { id: 'ps-k1', name: 'Türk Kahvesi', description: 'Geleneksel, lokum ile', price: 72, unit: 'fincan', emoji: '☕', popular: true },
        { id: 'ps-k2', name: 'Latte', description: 'Sütlü kahve', price: 88, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'ps-k3', name: 'Cappuccino', description: 'Köpüklü', price: 88, unit: 'bardak', emoji: '☕' },
        { id: 'ps-k4', name: 'Çay', description: 'Bardak', price: 18, unit: 'bardak', emoji: '🍵' },
        { id: 'ps-k5', name: 'Salep', description: 'Tarçınlı', price: 75, unit: 'bardak', emoji: '☕' },
        { id: 'ps-k6', name: 'Sıcak Çikolata', description: 'Kremalı', price: 92, unit: 'bardak', emoji: '🍫' },
        { id: 'ps-k7', name: 'Espresso', description: 'Double shot', price: 62, unit: 'fincan', emoji: '☕' },
      ],
    },
    {
      category: 'Soğuk İçecek',
      items: [
        { id: 'ps-si1', name: 'Milkshake', description: 'Çikolata/Vanilya/Çilek', price: 98, unit: 'bardak', emoji: '🥤', popular: true },
        { id: 'ps-si2', name: 'Limonata', description: 'Taze sıkma', price: 72, unit: 'bardak', emoji: '🍋' },
        { id: 'ps-si3', name: 'Buzlu Kahve', description: 'Frapuccino tarzı', price: 95, unit: 'bardak', emoji: '🧋' },
        { id: 'ps-si4', name: 'Meyve Suyu Taze', description: 'Portakal/Havuç', price: 55, unit: 'bardak', emoji: '🍊' },
      ],
    },
  ],
};

const KASAP: Store = {
  id: 'kasap',
  name: 'Kasap Ali Et ve Tavuk Şarküteri',
  type: 'butcher',
  emoji: '🥩',
  tagline: 'Günlük taze et · Güvenilir tartım',
  bannerColor: '#7B1A1A',
  rating: 4.8,
  etaMin: 25,
  minOrder: 150,
  address: 'Eski Konak Cd. No:53, Bartın',
  phone: '+90 533 465 47 77',
  openingHours: 'Mo-Su 09:00-21:00',
  sections: [
    {
      category: 'Dana Eti',
      items: [
        { id: 'ks-d1', name: 'Dana Kıyma 500g', description: 'Yağlı/yağsız, taze çekilmiş', price: 158, unit: 'paket', emoji: '🥩', popular: true },
        { id: 'ks-d2', name: 'Dana Kuşbaşı 500g', description: 'Güveç/kavurma için', price: 175, unit: 'paket', emoji: '🥩', popular: true },
        { id: 'ks-d3', name: 'Dana Antrikot 500g', description: 'Izgaralık', price: 298, unit: 'paket', emoji: '🥩' },
        { id: 'ks-d4', name: 'Dana Bonfile 500g', description: 'Premium', price: 365, unit: 'paket', emoji: '🥩' },
        { id: 'ks-d5', name: 'Dana Kaburga 1kg', description: 'Haşlama/fırın için', price: 265, unit: 'kg', emoji: '🦴' },
        { id: 'ks-d6', name: 'Ciğer 500g', description: 'Dana ciğeri, taze', price: 128, unit: 'paket', emoji: '🥩' },
        { id: 'ks-d7', name: 'Dana Kemikli 1kg', description: 'Çorba/haşlama', price: 148, unit: 'kg', emoji: '🦴' },
      ],
    },
    {
      category: 'Kuzu Eti',
      items: [
        { id: 'ks-k1', name: 'Kuzu Pirzola 500g', description: 'Izgara için', price: 325, unit: 'paket', emoji: '🍖', popular: true },
        { id: 'ks-k2', name: 'Kuzu Kıyma 500g', description: 'Taze', price: 198, unit: 'paket', emoji: '🥩' },
        { id: 'ks-k3', name: 'Kuzu But 1kg', description: 'Fırın için', price: 295, unit: 'kg', emoji: '🍖' },
      ],
    },
    {
      category: 'Tavuk',
      items: [
        { id: 'ks-t1', name: 'Tavuk Bütün ~2kg', description: 'Günlük taze', price: 295, unit: 'adet', emoji: '🍗', popular: true },
        { id: 'ks-t2', name: 'Tavuk Göğsü 1kg', description: 'Biftek dilimleme', price: 172, unit: 'kg', emoji: '🍗' },
        { id: 'ks-t3', name: 'Tavuk Kanat 1kg', description: 'Fırın/ızgara için', price: 148, unit: 'kg', emoji: '🍗' },
        { id: 'ks-t4', name: 'Tavuk Kıyma 500g', description: 'Köfte/dolma için', price: 132, unit: 'paket', emoji: '🍗' },
        { id: 'ks-t5', name: 'Tavuk But 1kg', description: 'Kemikli', price: 155, unit: 'kg', emoji: '🍗' },
      ],
    },
    {
      category: 'Şarküteri',
      items: [
        { id: 'ks-s1', name: 'Pastırma 200g', description: 'Kayseri pastırması', price: 195, unit: 'paket', emoji: '🥓', popular: true },
        { id: 'ks-s2', name: 'Sucuk 500g', description: 'Samsun sucuğu, acılı', price: 225, unit: 'halka', emoji: '🌭', popular: true },
        { id: 'ks-s3', name: 'Kavurma 400g', description: 'Kuzu kavurma, kavanozu', price: 285, unit: 'kavanoz', emoji: '🥩' },
        { id: 'ks-s4', name: 'Sosis 300g', description: 'Dana, taze yapım', price: 98, unit: 'paket', emoji: '🌭' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL SUPERMARKETS (real OSM names)
// ─────────────────────────────────────────────────────────────────────────────

const BALMAR: Store = {
  id: 'balmar',
  name: 'Balmar Süpermarket',
  type: 'supermarket',
  emoji: '🏪',
  tagline: 'Bartın\'ın yerel marketi · Taze ve uygun',
  logo: '/logos/balmar.svg',
  bannerColor: '#2B38AE',
  rating: 4.0,
  etaMin: 18,
  minOrder: 40,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Süt & Kahvaltılık',
      items: [
        { id: 'blm-s1', name: 'Süt 1L', description: 'Günlük pastörize', price: 30, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'blm-s2', name: 'Yumurta 10\'lu', description: 'Çiftlik yumurtası', price: 60, unit: 'koli', emoji: '🥚', popular: true },
        { id: 'blm-s3', name: 'Beyaz Peynir 400g', description: 'Tuzlu', price: 110, unit: 'paket', emoji: '🧀' },
        { id: 'blm-s4', name: 'Zeytin 400g', description: 'Yeşil/siyah karışık', price: 85, unit: 'kase', emoji: '🫒' },
        { id: 'blm-s5', name: 'Tereyağı 250g', description: 'Köy tereyağı', price: 140, unit: 'paket', emoji: '🧈', popular: true },
      ],
    },
    {
      category: 'Ekmek & Unlu',
      items: [
        { id: 'blm-e1', name: 'Ekmek', description: 'Taze pide, günlük', price: 9, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'blm-e2', name: 'Poğaça', description: 'Ev yapımı, peynirli', price: 20, unit: 'adet', emoji: '🥐' },
        { id: 'blm-e3', name: 'Tost Ekmeği', description: '10 dilim', price: 45, unit: 'paket', emoji: '🍞' },
      ],
    },
    {
      category: 'Temel Ürünler',
      items: [
        { id: 'blm-t1', name: 'Pirinç 1kg', description: 'Baldo', price: 78, unit: 'kg', emoji: '🌾', popular: true },
        { id: 'blm-t2', name: 'Makarna 500g', description: 'Çeşitli', price: 28, unit: 'paket', emoji: '🍝' },
        { id: 'blm-t3', name: 'Ayçiçek Yağı 1L', description: 'Rafine', price: 50, unit: 'şişe', emoji: '🌻' },
        { id: 'blm-t4', name: 'Şeker 1kg', description: 'Toz', price: 48, unit: 'kg', emoji: '🍬' },
        { id: 'blm-t5', name: 'Çay 200g', description: 'Çaykur', price: 48, unit: 'paket', emoji: '🍵', popular: true },
        { id: 'blm-t6', name: 'Domates Salçası 700g', description: 'Tukaş', price: 62, unit: 'teneke', emoji: '🍅' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'blm-i1', name: 'Su 1.5L', description: 'Soğuk', price: 12, unit: 'şişe', emoji: '💧', popular: true },
        { id: 'blm-i2', name: 'Kola 1L', description: 'Coca-Cola', price: 45, unit: 'şişe', emoji: '🥤' },
        { id: 'blm-i3', name: 'Ayran 500ml', description: 'Soğuk', price: 22, unit: 'şişe', emoji: '🥛' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// FAST FOOD (real OSM names from Bartın)
// ─────────────────────────────────────────────────────────────────────────────

const KOMAGENE: Store = {
  id: 'komagene',
  name: 'Komagene',
  type: 'fast_food',
  emoji: '🌯',
  tagline: 'Türkiye\'nin sevilen döner zinciri',
  rating: 4.3,
  logo: 'https://logo.clearbit.com/komagene.com.tr',
  bannerColor: '#1C1C1C',
  etaMin: 15,
  minOrder: 65,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 10:00-23:00',
  sections: [
    {
      category: 'Döner',
      items: [
        { id: 'kmg-1', name: 'İnce Döner Dürüm', description: 'Lavaşta, domates sos, turşu', price: 98, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'kmg-2', name: 'Kalın Döner Dürüm', description: 'Ekstra dolu', price: 118, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'kmg-3', name: 'Döner Ekmek', description: 'Köfte ekmeği tarzı', price: 88, unit: 'adet', emoji: '🥙' },
        { id: 'kmg-4', name: 'Döner Tabak', description: 'Pilav + salata dahil', price: 188, unit: 'tabak', emoji: '🥩' },
        { id: 'kmg-5', name: 'Tavuk Döner Dürüm', description: 'Izgara tavuk, özel sos', price: 92, unit: 'adet', emoji: '🌯' },
      ],
    },
    {
      category: 'Yanlar & İçecek',
      items: [
        { id: 'kmg-y1', name: 'Patates Kızartması', description: 'Büyük boy, çıtır', price: 62, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'kmg-y2', name: 'Pilav', description: 'Tereyağlı', price: 45, unit: 'tabak', emoji: '🍚' },
        { id: 'kmg-y3', name: 'Salata', description: 'Çoban', price: 42, unit: 'kase', emoji: '🥗' },
        { id: 'kmg-ic1', name: 'Ayran', description: 'Soğuk', price: 25, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'kmg-ic2', name: 'Kola 330ml', description: 'Soğuk kutu', price: 38, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const BURGER_KING: Store = {
  id: 'burger-king',
  name: 'Burger King',
  type: 'fast_food',
  emoji: '🍔',
  tagline: 'Have it your way · Alev ızgara burgerler',
  rating: 4.1,
  logo: 'https://logo.clearbit.com/burgerking.com',
  bannerColor: '#502314',
  etaMin: 20,
  minOrder: 80,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 09:00-23:00',
  sections: [
    {
      category: 'Burgerler',
      items: [
        { id: 'bk-b1', name: 'Whopper', description: 'İmza burgeri, büyük boy', price: 148, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'bk-b2', name: 'Whopper Jr', description: 'Küçük boy', price: 118, unit: 'adet', emoji: '🍔' },
        { id: 'bk-b3', name: 'Chicken Royale', description: 'Çıtır tavuk fileto', price: 128, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'bk-b4', name: 'Big King', description: 'Çift katlı', price: 138, unit: 'adet', emoji: '🍔' },
        { id: 'bk-b5', name: 'Long Chicken', description: 'Uzun boy çıtır tavuk', price: 108, unit: 'adet', emoji: '🥪' },
        { id: 'bk-b6', name: 'Cheeseburger', description: 'Kaşarlı klasik', price: 88, unit: 'adet', emoji: '🍔' },
      ],
    },
    {
      category: 'Menüler',
      items: [
        { id: 'bk-m1', name: 'Whopper Menü', description: 'Burger + Orta Patates + İçecek', price: 215, unit: 'set', emoji: '🍔', popular: true },
        { id: 'bk-m2', name: 'Chicken Royale Menü', description: 'Burger + Orta Patates + İçecek', price: 195, unit: 'set', emoji: '🍗', popular: true },
        { id: 'bk-m3', name: 'Kids Menü', description: 'Küçük burger + küçük patates + oyuncak', price: 125, unit: 'set', emoji: '🧸' },
      ],
    },
    {
      category: 'Yanlar & Tatlılar',
      items: [
        { id: 'bk-y1', name: 'Patates Kızartması Büyük', description: 'Çıtır', price: 72, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'bk-y2', name: 'Soğan Halkası', description: '9 adet', price: 65, unit: 'porsiyon', emoji: '🧅' },
        { id: 'bk-y3', name: 'Mozarella Sticks', description: '4 adet, sos dahil', price: 88, unit: 'porsiyon', emoji: '🧀' },
        { id: 'bk-y4', name: 'Sundae Dondurma', description: 'Çikolata/Karamel', price: 52, unit: 'adet', emoji: '🍦' },
        { id: 'bk-y5', name: 'Apple Pie', description: 'Sıcak elmalı', price: 42, unit: 'adet', emoji: '🥧' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'bk-ic1', name: 'Kola Orta', description: 'Büyük bardak', price: 42, unit: 'bardak', emoji: '🥤', popular: true },
        { id: 'bk-ic2', name: 'Ayran', description: 'Soğuk', price: 28, unit: 'bardak', emoji: '🥛' },
        { id: 'bk-ic3', name: 'Milkshake', description: 'Çikolata/Vanilya/Çilek', price: 75, unit: 'bardak', emoji: '🥤', popular: true },
        { id: 'bk-ic4', name: 'Portakal Suyu', description: 'Taze sıkma', price: 48, unit: 'bardak', emoji: '🍊' },
      ],
    },
  ],
};

const DOMINOS: Store = {
  id: 'dominos',
  name: 'Domino\'s Pizza',
  type: 'fast_food',
  emoji: '🍕',
  tagline: '30 dakika veya bedava · Sıcak pizza garantisi',
  rating: 4.0,
  logo: 'https://logo.clearbit.com/dominos.com',
  bannerColor: '#006491',
  etaMin: 30,
  minOrder: 100,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 11:00-23:30',
  sections: [
    {
      category: 'Klasik Pizzalar',
      items: [
        { id: 'dmn-1', name: 'Pepperoni Küçük', description: 'Pepperoni + kaşar, 25cm', price: 158, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'dmn-2', name: 'Pepperoni Orta', description: '30cm', price: 198, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'dmn-3', name: 'Margherita Orta', description: 'Domates sos + mozzarella, 30cm', price: 178, unit: 'adet', emoji: '🍕' },
        { id: 'dmn-4', name: '4 Peynirli Orta', description: 'Mozzarella, kaşar, gouda, parmesan', price: 215, unit: 'adet', emoji: '🍕' },
        { id: 'dmn-5', name: 'Karışık Büyük', description: 'Pepperoni, mantar, biber, zeytin, 35cm', price: 268, unit: 'adet', emoji: '🍕', popular: true },
      ],
    },
    {
      category: 'Özel Pizzalar',
      items: [
        { id: 'dmn-6', name: 'BBQ Tavuk Orta', description: 'BBQ sos + izgara tavuk + soğan', price: 215, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'dmn-7', name: 'Tavuk & Mantar Büyük', description: 'Özel sos, kremalı', price: 255, unit: 'adet', emoji: '🍕' },
        { id: 'dmn-8', name: 'Sucuklu Orta', description: 'Yerli sucuk + kaşar', price: 205, unit: 'adet', emoji: '🍕', popular: true },
      ],
    },
    {
      category: 'Yanlar & Tatlı',
      items: [
        { id: 'dmn-y1', name: 'Çıtır Kanatlar 8\'li', description: 'Buffalo/BBQ sos ile', price: 148, unit: 'porsiyon', emoji: '🍗', popular: true },
        { id: 'dmn-y2', name: 'Mozarella Çubuklar 5\'li', description: 'Marinara sos ile', price: 88, unit: 'porsiyon', emoji: '🧀' },
        { id: 'dmn-y3', name: 'Sarımsaklı Ekmek', description: 'Tereyağlı', price: 58, unit: 'porsiyon', emoji: '🥖' },
        { id: 'dmn-y4', name: 'Çikolatalı Lava Cake', description: 'Sıcak, içi akışkan', price: 75, unit: 'adet', emoji: '🍫', popular: true },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'dmn-ic1', name: 'Kola 1L', description: 'Coca-Cola şişe', price: 55, unit: 'şişe', emoji: '🥤', popular: true },
        { id: 'dmn-ic2', name: 'Ayran', description: '330ml', price: 22, unit: 'kutu', emoji: '🥛' },
        { id: 'dmn-ic3', name: 'Su 500ml', description: 'Soğuk', price: 12, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const KOZMOS_PIZZA: Store = {
  id: 'kozmos-pizza',
  name: 'Kozmos Pizza',
  type: 'fast_food',
  emoji: '🍕',
  tagline: 'Bartın\'ın sevilen pizza durağı · El yapımı hamur',
  rating: 4.4,
  bannerColor: '#C0392B',
  etaMin: 25,
  minOrder: 80,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 11:00-23:00',
  sections: [
    {
      category: 'Pizzalar',
      items: [
        { id: 'kzm-1', name: 'Kozmos Özel', description: 'Sucuk + biber + mantar + kaşar', price: 195, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'kzm-2', name: 'Margarita', description: 'Domates + mozzarella + fesleğen', price: 155, unit: 'adet', emoji: '🍕' },
        { id: 'kzm-3', name: 'Tavuk Pizza', description: 'Izgara tavuk + mantar + özel sos', price: 178, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'kzm-4', name: 'Et Karnavalı', description: 'Sucuk + pastırma + kıyma', price: 215, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'kzm-5', name: 'Vejetaryen', description: 'Mantar + biber + zeytin + mısır', price: 162, unit: 'adet', emoji: '🍕' },
      ],
    },
    {
      category: 'Burger & Sandviç',
      items: [
        { id: 'kzm-b1', name: 'Kozmos Burger', description: 'Dana + kaşar + özel sos', price: 128, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'kzm-b2', name: 'Crispy Chicken', description: 'Çıtır tavuk sandviç', price: 108, unit: 'adet', emoji: '🥪' },
        { id: 'kzm-b3', name: 'Tost Özel', description: 'Kaşar + domates + sucuk + mantar', price: 85, unit: 'adet', emoji: '🥪' },
      ],
    },
    {
      category: 'Yanlar & İçecek',
      items: [
        { id: 'kzm-y1', name: 'Patates Kızartması', description: 'Büyük', price: 65, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'kzm-ic1', name: 'Kola', description: '330ml', price: 38, unit: 'kutu', emoji: '🥤' },
        { id: 'kzm-ic2', name: 'Ayran', description: 'Soğuk', price: 25, unit: 'bardak', emoji: '🥛' },
      ],
    },
  ],
};

const POPEYES: Store = {
  id: 'popeyes',
  name: 'Popeyes',
  type: 'fast_food',
  emoji: '🍗',
  tagline: 'Louisiana tarzı çıtır tavuk',
  rating: 4.2,
  logo: 'https://logo.clearbit.com/popeyes.com',
  bannerColor: '#E47200',
  etaMin: 20,
  minOrder: 75,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 10:00-23:00',
  sections: [
    {
      category: 'Tavuk',
      items: [
        { id: 'pp-1', name: 'Chicken Sandwich', description: 'İmza çıtır tavuk sandviçi', price: 128, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'pp-2', name: 'Spicy Chicken Sandwich', description: 'Acılı versiyon', price: 128, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'pp-3', name: 'Kanat 4\'lü', description: 'Louisiana baharatlı', price: 118, unit: 'porsiyon', emoji: '🍗', popular: true },
        { id: 'pp-4', name: 'Kanat 8\'li', description: 'Aile boyu', price: 218, unit: 'porsiyon', emoji: '🍗' },
        { id: 'pp-5', name: 'Bütün But', description: 'Crispy', price: 95, unit: 'adet', emoji: '🍗' },
        { id: 'pp-6', name: 'Nugget 6\'lı', description: 'Dip sos ile', price: 88, unit: 'porsiyon', emoji: '🍗' },
      ],
    },
    {
      category: 'Menüler',
      items: [
        { id: 'pp-m1', name: 'Chicken Sandwich Menü', description: '+ Patates + İçecek', price: 188, unit: 'set', emoji: '🥪', popular: true },
        { id: 'pp-m2', name: 'Kanat Menü 4\'lü', description: '+ Patates + İçecek', price: 178, unit: 'set', emoji: '🍗' },
      ],
    },
    {
      category: 'Yanlar & İçecek',
      items: [
        { id: 'pp-y1', name: 'Cajun Fries', description: 'Baharatlı patates', price: 68, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'pp-y2', name: 'Coleslaw', description: 'Soğuk lahana salatası', price: 42, unit: 'kase', emoji: '🥗' },
        { id: 'pp-y3', name: 'Corn on the Cob', description: 'Mısır koçanı', price: 45, unit: 'adet', emoji: '🌽' },
        { id: 'pp-ic1', name: 'Ayran', description: 'Soğuk', price: 25, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'pp-ic2', name: 'Kola', description: '330ml', price: 38, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const SWEETARTS: Store = {
  id: 'sweetarts',
  name: 'SweetArts',
  type: 'cafe',
  emoji: '🧇',
  tagline: 'Waffle · Kumpir · Coffee · sweetarts.com.tr',
  rating: 4.5,
  logo: 'https://logo.clearbit.com/sweetarts.com.tr',
  bannerColor: '#D63384',
  etaMin: 20,
  minOrder: 60,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 09:00-22:00',
  sections: [
    {
      category: 'Waffle',
      items: [
        { id: 'sw-w1', name: 'Klasik Waffle', description: 'Nutella + muz + fıstık ezmesi', price: 88, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'sw-w2', name: 'Çikolatalı Waffle', description: 'Çikolata sos + dondurma', price: 95, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'sw-w3', name: 'Meyveli Waffle', description: 'Çilek + yaban mersini + krema', price: 105, unit: 'adet', emoji: '🧇' },
        { id: 'sw-w4', name: 'Sade Waffle', description: 'Bal + tereyağı', price: 72, unit: 'adet', emoji: '🧇' },
        { id: 'sw-w5', name: 'Karamelli Waffle', description: 'Tuzlu karamel + fındık', price: 98, unit: 'adet', emoji: '🧇' },
      ],
    },
    {
      category: 'Kumpir',
      items: [
        { id: 'sw-k1', name: 'Klasik Kumpir', description: 'Tereyağı + kaşar + 5 malzeme seçim', price: 85, unit: 'adet', emoji: '🥔', popular: true },
        { id: 'sw-k2', name: 'Özel Kumpir', description: 'Tereyağı + kaşar + 10 malzeme seçim', price: 118, unit: 'adet', emoji: '🥔', popular: true },
        { id: 'sw-k3', name: 'Et\'li Kumpir', description: 'Dana kıyma + sucuk + özel malzemeler', price: 138, unit: 'adet', emoji: '🥔' },
      ],
    },
    {
      category: 'Kahve & İçecek',
      items: [
        { id: 'sw-c1', name: 'Latte', description: 'Sütlü espresso', price: 78, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'sw-c2', name: 'Buzlu Latte', description: 'Soğuk', price: 82, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'sw-c3', name: 'Türk Kahvesi', description: 'Geleneksel', price: 68, unit: 'fincan', emoji: '☕' },
        { id: 'sw-c4', name: 'Limonata', description: 'Taze sıkma', price: 62, unit: 'bardak', emoji: '🍋' },
        { id: 'sw-c5', name: 'Milkshake', description: 'Çikolata/Vanilya/Çilek', price: 92, unit: 'bardak', emoji: '🥤', popular: true },
        { id: 'sw-c6', name: 'Çikolatalı Shake', description: 'Nutella bazlı', price: 98, unit: 'bardak', emoji: '🥤' },
      ],
    },
  ],
};

const BUGILLER: Store = {
  id: 'bugiller',
  name: 'Bugiller Pilavcısı',
  type: 'restaurant',
  emoji: '🍚',
  tagline: 'Ev yemeği lezzeti · Günlük pilav ve çorba',
  rating: 4.6,
  etaMin: 20,
  minOrder: 50,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 10:00-18:00',
  sections: [
    {
      category: 'Pilav Üstleri',
      items: [
        { id: 'bg-1', name: 'Pilav Üzeri Tavuk', description: 'Tereyağlı pilav + ızgara tavuk + sos', price: 78, unit: 'tabak', emoji: '🍚', popular: true },
        { id: 'bg-2', name: 'Pilav Üzeri Nohutlu', description: 'Tereyağlı pilav + haşlanmış nohut', price: 65, unit: 'tabak', emoji: '🍚', popular: true },
        { id: 'bg-3', name: 'Pilav Üzeri Kuru Fasulye', description: 'Fasulye + sulu pişmiş', price: 62, unit: 'tabak', emoji: '🍚' },
        { id: 'bg-4', name: 'İzmir Köfte + Pilav', description: 'Domates soslu köfte + pilav', price: 98, unit: 'tabak', emoji: '🥩', popular: true },
        { id: 'bg-5', name: 'Hünkarbeğendi', description: 'Közlenmiş patlıcan püresi üzeri kuşbaşı', price: 125, unit: 'tabak', emoji: '🥩' },
        { id: 'bg-6', name: 'Bamya + Pilav', description: 'Zeytinyağlı bamya', price: 68, unit: 'tabak', emoji: '🥬' },
      ],
    },
    {
      category: 'Çorbalar',
      items: [
        { id: 'bg-c1', name: 'Mercimek Çorbası', description: 'Tereyağlı, limonlu', price: 48, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'bg-c2', name: 'Ezogelin Çorbası', description: 'Baharatlı', price: 48, unit: 'kase', emoji: '🍲' },
        { id: 'bg-c3', name: 'Yayla Çorbası', description: 'Yoğurtlu, nane', price: 48, unit: 'kase', emoji: '🍲' },
      ],
    },
    {
      category: 'Tatlı & İçecek',
      items: [
        { id: 'bg-t1', name: 'Sütlaç', description: 'Fırında', price: 45, unit: 'kase', emoji: '🍮', popular: true },
        { id: 'bg-t2', name: 'Ayran', description: 'Soğuk', price: 22, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'bg-t3', name: 'Çay', description: 'Bardak', price: 12, unit: 'bardak', emoji: '🍵' },
        { id: 'bg-t4', name: 'Su', description: '500ml', price: 10, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const ALACATI: Store = {
  id: 'alacati',
  name: 'Alaçatı Muallebicisi',
  type: 'cafe',
  emoji: '🍮',
  tagline: 'Geleneksel Türk tatlıları · Muhallebi ustası',
  bannerColor: '#5D4037',
  rating: 4.5,
  etaMin: 20,
  minOrder: 45,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 10:00-22:00',
  sections: [
    {
      category: 'Muhallebiler & Sütlü Tatlılar',
      items: [
        { id: 'ac-1', name: 'Muhallebi', description: 'Klasik süt muhallebisi', price: 45, unit: 'kase', emoji: '🍮', popular: true },
        { id: 'ac-2', name: 'Kazandibi', description: 'Geleneksel, karamelize', price: 48, unit: 'dilim', emoji: '🍮', popular: true },
        { id: 'ac-3', name: 'Fırın Sütlaç', description: 'Üstü kızarmış', price: 52, unit: 'kase', emoji: '🍮', popular: true },
        { id: 'ac-4', name: 'Tavuk Göğsü', description: 'İpeksi doku, geleneksel', price: 48, unit: 'dilim', emoji: '🍮' },
        { id: 'ac-5', name: 'Güllaç', description: 'Ramazan tatlısı, her mevsim', price: 55, unit: 'dilim', emoji: '🍮' },
        { id: 'ac-6', name: 'Keşkül', description: 'Bademli muhallebi', price: 52, unit: 'kase', emoji: '🍮' },
      ],
    },
    {
      category: 'Dondurma & Soğuk Tatlı',
      items: [
        { id: 'ac-d1', name: 'Maraş Dondurması', description: '2 top, konik', price: 52, unit: 'adet', emoji: '🍦', popular: true },
        { id: 'ac-d2', name: 'Profiterol', description: 'Çikolata sos, 6 adet', price: 78, unit: 'porsiyon', emoji: '🍫' },
        { id: 'ac-d3', name: 'Dondurmalı Baklava', description: '4 dilim + dondurma', price: 115, unit: 'porsiyon', emoji: '🍮', popular: true },
        { id: 'ac-d4', name: 'Aşure', description: 'Geleneksel, mevsimlik', price: 48, unit: 'kase', emoji: '🫘' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'ac-ic1', name: 'Türk Kahvesi', description: 'Geleneksel', price: 68, unit: 'fincan', emoji: '☕', popular: true },
        { id: 'ac-ic2', name: 'Salep', description: 'Tarçınlı, sıcak', price: 72, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'ac-ic3', name: 'Çay', description: 'Rize bardak', price: 15, unit: 'bardak', emoji: '🍵' },
        { id: 'ac-ic4', name: 'Boza', description: 'Geleneksel fermente', price: 38, unit: 'bardak', emoji: '🫗' },
      ],
    },
  ],
};

const BALKAYA: Store = {
  id: 'balkaya',
  name: 'Balkaya Pastanesi',
  type: 'cafe',
  emoji: '🎂',
  tagline: 'Bartın\'ın köklü pastanesi · Özel günler için',
  bannerColor: '#AD1457',
  rating: 4.7,
  etaMin: 15,
  minOrder: 50,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Pasta & Tatlı',
      items: [
        { id: 'bly-1', name: 'Yaş Pasta Dilimi', description: 'Çikolatalı/meyveli, günlük', price: 78, unit: 'dilim', emoji: '🎂', popular: true },
        { id: 'bly-2', name: 'Baklava 1kg', description: 'Antep fıstıklı, fırından', price: 485, unit: 'kg', emoji: '🍮', popular: true },
        { id: 'bly-3', name: 'Baklava 500g', description: 'Yarım kilo', price: 248, unit: 'kutu', emoji: '🍮' },
        { id: 'bly-4', name: 'Şekerpare', description: 'Üzeri fıstıklı', price: 45, unit: 'dilim', emoji: '🍯' },
        { id: 'bly-5', name: 'Revani', description: 'İrmik tatlısı, limonlu', price: 42, unit: 'dilim', emoji: '🍯' },
        { id: 'bly-6', name: 'Cheesecake', description: 'Çilekli, ev yapımı', price: 88, unit: 'dilim', emoji: '🍰', popular: true },
        { id: 'bly-7', name: 'Profiterol', description: 'Çikolata sosu, 6 adet', price: 85, unit: 'porsiyon', emoji: '🍫' },
      ],
    },
    {
      category: 'Börek & Tuzlular',
      items: [
        { id: 'bly-b1', name: 'Su Böreği', description: 'Ev yapımı peynirli, 4 dilim', price: 92, unit: 'kutu', emoji: '🥧', popular: true },
        { id: 'bly-b2', name: 'Sigara Böreği 5\'li', description: 'Peynirli çıtır', price: 62, unit: 'tabak', emoji: '🥟' },
        { id: 'bly-b3', name: 'Poğaça', description: 'Zeytinli/peynirli', price: 22, unit: 'adet', emoji: '🥐' },
        { id: 'bly-b4', name: 'Tost', description: 'Sucuklu kaşarlı', price: 82, unit: 'adet', emoji: '🥪', popular: true },
      ],
    },
    {
      category: 'Kahve & İçecek',
      items: [
        { id: 'bly-k1', name: 'Türk Kahvesi', description: 'Geleneksel, lokum ile', price: 70, unit: 'fincan', emoji: '☕', popular: true },
        { id: 'bly-k2', name: 'Latte', description: 'Çift shot', price: 88, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'bly-k3', name: 'Salep', description: 'Tarçınlı', price: 72, unit: 'bardak', emoji: '☕' },
        { id: 'bly-k4', name: 'Çay', description: 'Bardak', price: 15, unit: 'bardak', emoji: '🍵' },
      ],
    },
  ],
};

const MACKBEAR: Store = {
  id: 'mackbear',
  name: 'Mackbear Coffee',
  type: 'cafe',
  emoji: '☕',
  tagline: 'Specialty coffee · Bartın\'daki kahve durağın',
  rating: 4.6,
  logo: 'https://logo.clearbit.com/mackbear.com',
  bannerColor: '#2C1810',
  etaMin: 15,
  minOrder: 45,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 08:00-22:00',
  sections: [
    {
      category: 'Espresso & Sıcak Kahve',
      items: [
        { id: 'mb-1', name: 'Espresso', description: 'Single/Double shot', price: 62, unit: 'fincan', emoji: '☕' },
        { id: 'mb-2', name: 'Americano', description: 'Uzun siyah', price: 72, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'mb-3', name: 'Latte', description: 'Sütlü espresso, 350ml', price: 82, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'mb-4', name: 'Cappuccino', description: 'Köpüklü, 250ml', price: 82, unit: 'bardak', emoji: '☕' },
        { id: 'mb-5', name: 'Flat White', description: 'Yoğun sütlü', price: 88, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'mb-6', name: 'Caramel Macchiato', description: 'Karamel + vanilyalı süt', price: 92, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'mb-7', name: 'Mocha', description: 'Çikolatalı latte', price: 88, unit: 'bardak', emoji: '☕' },
      ],
    },
    {
      category: 'Soğuk Kahve',
      items: [
        { id: 'mb-s1', name: 'Cold Brew', description: '24 saat demlenmiş, soğuk', price: 92, unit: 'bardak', emoji: '🧋', popular: true },
        { id: 'mb-s2', name: 'Iced Latte', description: 'Buzlu sütlü kahve', price: 88, unit: 'bardak', emoji: '🧋', popular: true },
        { id: 'mb-s3', name: 'Frappuccino', description: 'Blended, krema üstü', price: 98, unit: 'bardak', emoji: '🧋' },
        { id: 'mb-s4', name: 'Matcha Latte', description: 'Buzlu veya sıcak', price: 95, unit: 'bardak', emoji: '🍵', popular: true },
        { id: 'mb-s5', name: 'Strawberry Lemonade', description: 'Taze çilek + limon', price: 72, unit: 'bardak', emoji: '🍓' },
      ],
    },
    {
      category: 'Sandviç & Atıştırmalık',
      items: [
        { id: 'mb-f1', name: 'Avokado Toast', description: 'Ekşi maya + avokado + yumurta', price: 128, unit: 'adet', emoji: '🥑', popular: true },
        { id: 'mb-f2', name: 'Croissant', description: 'Sade veya kaşarlı', price: 55, unit: 'adet', emoji: '🥐', popular: true },
        { id: 'mb-f3', name: 'Cheesecake Dilimi', description: 'Günlük', price: 85, unit: 'dilim', emoji: '🍰' },
        { id: 'mb-f4', name: 'Granola Kase', description: 'Yoğurt + meyve + granola', price: 95, unit: 'kase', emoji: '🥣' },
        { id: 'mb-f5', name: 'Brownie', description: 'Çikolatalı, sıcak', price: 65, unit: 'adet', emoji: '🍫', popular: true },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SILA KEBAP & GECE DÖNERCİSİ
// ─────────────────────────────────────────────────────────────────────────────

const SILA_KEBAP: Store = {
  id: 'sila-kebap',
  name: 'Sıla Kebap & Gece Dönercisi',
  type: 'fast_food',
  emoji: '🥙',
  tagline: 'Mangal kebap · Geç saate açık · Halal',
  rating: 4.4,
  etaMin: 22,
  minOrder: 60,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 10:00-22:00',
  sections: [
    {
      category: 'Kebap & Dürüm',
      items: [
        { id: 'sk-1', name: 'Et Dürüm', description: 'Dana döner, lavaş, domates, soğan, sos', price: 95, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'sk-2', name: 'Tavuk Dürüm', description: 'Tavuk döner, lavaş, söğüş', price: 82, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'sk-3', name: 'Büyük Boy Et Dürüm', description: 'Çift et, ekstra malzeme', price: 138, unit: 'adet', emoji: '🥙' },
        { id: 'sk-4', name: 'Adana Dürüm', description: 'Acılı kıyma, lavaş', price: 105, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'sk-5', name: 'Şiş Kebap Porsiyon', description: 'Dana şiş, pide, közlenmiş biber', price: 175, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'sk-6', name: 'Karışık Döner Porsiyon', description: 'Et + tavuk, pilav veya pide', price: 165, unit: 'porsiyon', emoji: '🍢' },
      ],
    },
    {
      category: 'Pide & Ekmek Arası',
      items: [
        { id: 'sk-p1', name: 'Döner Ekmek', description: 'Et döner, somun ekmek', price: 65, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'sk-p2', name: 'Tavuk Ekmek', description: 'Tavuk döner, somun', price: 55, unit: 'adet', emoji: '🥪' },
        { id: 'sk-p3', name: 'Köfte Ekmek', description: 'Izgara köfte, ekmek', price: 62, unit: 'adet', emoji: '🥪' },
      ],
    },
    {
      category: 'Yan Ürünler & İçecek',
      items: [
        { id: 'sk-y1', name: 'Patates Kızartması', description: 'Büyük boy', price: 55, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'sk-y2', name: 'Çoban Salatası', description: 'Domates, salatalık, maydanoz', price: 38, unit: 'kase', emoji: '🥗' },
        { id: 'sk-y3', name: 'Cacık', description: 'Yoğurt + salatalık + nane', price: 32, unit: 'kase', emoji: '🥣' },
        { id: 'sk-y4', name: 'Ayran 500ml', description: 'Soğuk', price: 20, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'sk-y5', name: 'Kola 330ml', description: 'Soğuk kutu', price: 22, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PASAPORT PİZZA
// ─────────────────────────────────────────────────────────────────────────────

const PASAPORT_PIZZA: Store = {
  id: 'pasaport-pizza',
  name: 'Pasaport Pizza',
  type: 'fast_food',
  emoji: '🍕',
  tagline: 'Yerel pizza · El açması hamur · Odun fırını',
  rating: 4.2,
  etaMin: 30,
  minOrder: 80,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Pizza (26cm)',
      items: [
        { id: 'pp-1', name: 'Karışık Pizza', description: 'Sucuk, sosis, biber, mantar, kaşar', price: 155, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'pp-2', name: 'Margherita', description: 'Domates sos, mozzarella, fesleğen', price: 115, unit: 'adet', emoji: '🍕' },
        { id: 'pp-3', name: 'Sucuklu Pizza', description: 'Sucuk + kaşar + domates', price: 135, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'pp-4', name: 'Tavuk Pesto Pizza', description: 'Tavuk, fesleğen sos, mantar', price: 148, unit: 'adet', emoji: '🍕' },
        { id: 'pp-5', name: 'BBQ Tavuk Pizza', description: 'BBQ sos, tavuk, mısır, soğan', price: 152, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'pp-6', name: '4 Peynirli Pizza', description: 'Mozzarella, kaşar, çedar, rokfor', price: 162, unit: 'adet', emoji: '🍕' },
      ],
    },
    {
      category: 'Pizza (34cm Büyük)',
      items: [
        { id: 'pp-b1', name: 'Karışık Büyük', description: 'Aile boyu, 8 dilim', price: 238, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'pp-b2', name: 'Sucuklu Büyük', description: 'Aile boyu', price: 215, unit: 'adet', emoji: '🍕' },
        { id: 'pp-b3', name: 'Margherita Büyük', description: 'Aile boyu', price: 188, unit: 'adet', emoji: '🍕' },
      ],
    },
    {
      category: 'Fırın Ürünleri & İçecek',
      items: [
        { id: 'pp-f1', name: 'Çıtır Ekmek', description: 'Sarımsaklı tereyağ', price: 45, unit: 'adet', emoji: '🥖', popular: true },
        { id: 'pp-f2', name: 'Kaşarlı Fırın Tavuk', description: 'Üstü kaşarlı, fırında', price: 128, unit: 'porsiyon', emoji: '🍗' },
        { id: 'pp-y1', name: 'Kola 500ml', description: 'Soğuk şişe', price: 25, unit: 'şişe', emoji: '🥤', popular: true },
        { id: 'pp-y2', name: 'Ayran 330ml', description: 'Soğuk', price: 18, unit: 'kutu', emoji: '🥛' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MS DÖNER
// ─────────────────────────────────────────────────────────────────────────────

const MS_DONER: Store = {
  id: 'ms-doner',
  name: 'MS Döner',
  type: 'fast_food',
  emoji: '🥙',
  tagline: 'Helal döner · Uygun fiyat · Hızlı teslimat',
  rating: 4.1,
  etaMin: 18,
  minOrder: 50,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Döner Çeşitleri',
      items: [
        { id: 'msd-1', name: 'Et Dürüm', description: 'Dana döner, lavaş', price: 88, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'msd-2', name: 'Tavuk Dürüm', description: 'Tavuk döner, lavaş', price: 78, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'msd-3', name: 'Tantuni', description: 'Dana döner + kavurma, lavaş', price: 98, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'msd-4', name: 'Köfte Dürüm', description: 'Izgara köfte, lavaş', price: 85, unit: 'adet', emoji: '🥙' },
        { id: 'msd-5', name: 'Et Döner Ekmek', description: 'Somun + et döner', price: 62, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'msd-6', name: 'Et Döner Porsiyon', description: 'Pilav + döner + salata', price: 152, unit: 'porsiyon', emoji: '🍢' },
        { id: 'msd-7', name: 'Tavuk Döner Porsiyon', description: 'Pilav + döner + salata', price: 138, unit: 'porsiyon', emoji: '🍢' },
      ],
    },
    {
      category: 'Ekstra & İçecek',
      items: [
        { id: 'msd-e1', name: 'Patates Kızartması', description: 'Orta boy', price: 48, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'msd-e2', name: 'Ayran 300ml', description: 'Soğuk', price: 16, unit: 'kutu', emoji: '🥛', popular: true },
        { id: 'msd-e3', name: 'Kola 330ml', description: 'Kutu', price: 20, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ADIYAMAN OCAKBAŞI
// ─────────────────────────────────────────────────────────────────────────────

const ADIYAMAN_OCAKBASI: Store = {
  id: 'adiyaman-ocakbasi',
  name: 'Adıyaman Ocakbaşı',
  type: 'fast_food',
  emoji: '🔥',
  tagline: 'Güneydoğu lezzetleri · Acı kebap · Mangal',
  rating: 4.5,
  etaMin: 28,
  minOrder: 80,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Kebap',
      items: [
        { id: 'ao-1', name: 'Adana Kebap', description: 'Kıyma + acı biber, pide, közlenmiş', price: 188, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'ao-2', name: 'Urfa Kebap', description: 'Acısız kıyma, pide', price: 178, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'ao-3', name: 'Tavuk Şiş', description: 'Marineli tavuk, pide', price: 168, unit: 'porsiyon', emoji: '🍢' },
        { id: 'ao-4', name: 'Patlıcanlı Kebap', description: 'Dana kıyma + közlenmiş patlıcan', price: 195, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'ao-5', name: 'Kuzu Pirzola', description: 'Taze kuzu, 3 adet', price: 248, unit: 'porsiyon', emoji: '🍖', popular: true },
        { id: 'ao-6', name: 'Karışık Izgara', description: 'Adana + tavuk şiş + köfte, pide', price: 265, unit: 'porsiyon', emoji: '🍢' },
      ],
    },
    {
      category: 'Çorba & Meze',
      items: [
        { id: 'ao-c1', name: 'Büryan Çorbası', description: 'Kuzu kemik suyu, baharatlı', price: 58, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'ao-c2', name: 'Mercimek Çorbası', description: 'Kırmızı mercimek, tereyağı', price: 45, unit: 'kase', emoji: '🍲' },
        { id: 'ao-c3', name: 'Acılı Ezme', description: 'Domates + biber, közlenmiş', price: 38, unit: 'kase', emoji: '🌶️', popular: true },
        { id: 'ao-c4', name: 'Humus', description: 'Tahinli, zeytinyağlı', price: 42, unit: 'kase', emoji: '🫘' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'ao-i1', name: 'Ayran', description: 'Soğuk, köy tipi', price: 22, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'ao-i2', name: 'Şalgam Suyu', description: 'Adıyaman geleneksel', price: 25, unit: 'bardak', emoji: '🍷' },
        { id: 'ao-i3', name: 'Kola 330ml', description: 'Kutu', price: 22, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// GOLDBEANS COFFEE
// ─────────────────────────────────────────────────────────────────────────────

const GOLDBEANS: Store = {
  id: 'goldbeans',
  name: 'Goldbeans Coffee',
  type: 'cafe',
  emoji: '☕',
  tagline: 'Specialty kahve · Single origin · Barista seçimi',
  bannerColor: '#B8860B',
  rating: 4.6,
  etaMin: 18,
  minOrder: 45,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Espresso Bazlı',
      items: [
        { id: 'gb-1', name: 'Espresso', description: 'Single, 30ml', price: 52, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'gb-2', name: 'Doppio', description: 'Double shot, 60ml', price: 68, unit: 'bardak', emoji: '☕' },
        { id: 'gb-3', name: 'Americano', description: 'Espresso + sıcak su', price: 65, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'gb-4', name: 'Flat White', description: 'Double espresso + az mikro köpük', price: 88, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'gb-5', name: 'Cortado', description: 'Espresso + az süt', price: 75, unit: 'bardak', emoji: '☕' },
        { id: 'gb-6', name: 'Latte', description: '250ml', price: 88, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'gb-7', name: 'Cappuccino', description: 'Klasik, 180ml', price: 82, unit: 'bardak', emoji: '☕' },
      ],
    },
    {
      category: 'Filter & Alternatif',
      items: [
        { id: 'gb-f1', name: 'V60 Filter', description: 'Single origin, günlük değişir', price: 78, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'gb-f2', name: 'Cold Brew', description: '18 saat demlenmiş', price: 98, unit: 'bardak', emoji: '🧋', popular: true },
        { id: 'gb-f3', name: 'Matcha Latte', description: 'Ceremonial grade matcha', price: 95, unit: 'bardak', emoji: '🍵', popular: true },
        { id: 'gb-f4', name: 'Salep', description: 'Orjinal kış içeceği, tarçınlı', price: 72, unit: 'bardak', emoji: '🍵' },
      ],
    },
    {
      category: 'Atıştırmalık',
      items: [
        { id: 'gb-a1', name: 'Cheesecake', description: 'Günlük ev yapımı', price: 88, unit: 'dilim', emoji: '🍰', popular: true },
        { id: 'gb-a2', name: 'Croissant Sade', description: 'Fransız tipi', price: 48, unit: 'adet', emoji: '🥐', popular: true },
        { id: 'gb-a3', name: 'Brownie', description: 'Bitter çikolata', price: 65, unit: 'adet', emoji: '🍫' },
        { id: 'gb-a4', name: 'Tiramisu', description: 'Cam kavanozda', price: 95, unit: 'adet', emoji: '🍮', popular: true },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ARABİCA COFFEE HOUSE
// ─────────────────────────────────────────────────────────────────────────────

const ARABICA: Store = {
  id: 'arabica-coffee',
  name: 'Arabica Coffee House',
  type: 'cafe',
  emoji: '☕',
  tagline: 'Bahçeli kafe · Paket servis · Ev yapımı tatlılar',
  rating: 4.3,
  etaMin: 20,
  minOrder: 40,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Kahve',
      items: [
        { id: 'ar-1', name: 'Türk Kahvesi', description: 'Sade / orta / çok şekerli', price: 38, unit: 'fincan', emoji: '☕', popular: true },
        { id: 'ar-2', name: 'Latte', description: 'Sütlü espresso', price: 78, unit: 'bardak', emoji: '☕', popular: true },
        { id: 'ar-3', name: 'Sütlü Kahve', description: 'Bol sütlü, tatlı', price: 65, unit: 'bardak', emoji: '☕' },
        { id: 'ar-4', name: 'Iced Latte', description: 'Buzlu, şekersiz veya şekerli', price: 82, unit: 'bardak', emoji: '🧋', popular: true },
        { id: 'ar-5', name: 'Menengiç Kahvesi', description: 'Antep meşe kahvesi, geleneksel', price: 45, unit: 'fincan', emoji: '☕' },
      ],
    },
    {
      category: 'Çay & Sıcak İçecek',
      items: [
        { id: 'ar-c1', name: 'Çay', description: 'Demlik çay, bardak', price: 18, unit: 'bardak', emoji: '🍵', popular: true },
        { id: 'ar-c2', name: 'Bitki Çayı', description: 'Ihlamur / nane / adaçayı', price: 28, unit: 'demlik', emoji: '🍵' },
        { id: 'ar-c3', name: 'Sıcak Çikolata', description: 'Tam yağlı süt', price: 55, unit: 'bardak', emoji: '🍫', popular: true },
      ],
    },
    {
      category: 'Tatlı & Atıştırmalık',
      items: [
        { id: 'ar-t1', name: 'Ev Yapımı Kek', description: 'Günlük değişir (havuç/limon/çikolata)', price: 55, unit: 'dilim', emoji: '🎂', popular: true },
        { id: 'ar-t2', name: 'Waffle', description: 'Muzlu, çikolata sos', price: 75, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'ar-t3', name: 'Poğaça', description: 'Peynirli, taze pişmiş', price: 28, unit: 'adet', emoji: '🥐' },
        { id: 'ar-t4', name: 'Kurabiye Tabağı', description: '5 adet karışık', price: 48, unit: 'tabak', emoji: '🍪' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// VİLLAPARK RESTAURANT
// ─────────────────────────────────────────────────────────────────────────────

const VILLAPARK: Store = {
  id: 'villapark',
  name: 'Villapark Restaurant',
  type: 'restaurant',
  emoji: '🍽️',
  tagline: 'Türk & yöresel mutfak · Manzaralı teras · Özel günler',
  rating: 4.5,
  etaMin: 32,
  minOrder: 100,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Izgara',
      items: [
        { id: 'vp-1', name: 'Izgara Köfte', description: 'Dana kıyma, piyaz + salata', price: 178, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'vp-2', name: 'Karışık Izgara', description: 'Köfte + şiş + kanat, pide', price: 265, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'vp-3', name: 'Tavuk Pirzola', description: 'Marine edilmiş, pide üstü', price: 188, unit: 'porsiyon', emoji: '🍗' },
        { id: 'vp-4', name: 'Piliç Kanat', description: '6 adet, baharatlı', price: 168, unit: 'porsiyon', emoji: '🍗', popular: true },
      ],
    },
    {
      category: 'Balık',
      items: [
        { id: 'vp-b1', name: 'Levrek Izgara', description: 'Taze deniz levreği, sebzeli', price: 245, unit: 'porsiyon', emoji: '🐟', popular: true },
        { id: 'vp-b2', name: 'Alabalık', description: 'Yerel alabalık, fırında', price: 198, unit: 'adet', emoji: '🐟' },
        { id: 'vp-b3', name: 'Karides Güveç', description: 'Tereyağlı, domatesli', price: 228, unit: 'güveç', emoji: '🦐', popular: true },
      ],
    },
    {
      category: 'Yöresel Lezzetler',
      items: [
        { id: 'vp-y1', name: 'Saç Kavurma', description: 'Dana eti, biber, soğan, mantarlı', price: 215, unit: 'porsiyon', emoji: '🍳', popular: true },
        { id: 'vp-y2', name: 'Etli Güveç', description: 'Kuzu, sebze, çömlek', price: 195, unit: 'güveç', emoji: '🍲' },
        { id: 'vp-y3', name: 'Çiğ Köfte Salata', description: 'Nar ekşili, maydanozlu, bol limonlu', price: 58, unit: 'porsiyon', emoji: '🥗', popular: true },
        { id: 'vp-y4', name: 'Künefe', description: 'Hatay usulü, peynirli, şerbetli', price: 118, unit: 'porsiyon', emoji: '🧀', popular: true },
      ],
    },
    {
      category: 'Çorba',
      items: [
        { id: 'vp-c1', name: 'Günlük Çorba', description: 'Şef seçimi, taze', price: 52, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'vp-c2', name: 'İşkembe Çorbası', description: 'Geleneksel, sarımsaklı', price: 65, unit: 'kase', emoji: '🍲' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BARTIN KENT LOKANTASI
// ─────────────────────────────────────────────────────────────────────────────

const BARTIN_KENT: Store = {
  id: 'bartin-kent',
  name: 'Bartın Kent Lokantası',
  type: 'restaurant',
  emoji: '🏠',
  tagline: 'Ev yemeği · Günlük menü · Öğle 12:00–17:00',
  rating: 4.3,
  etaMin: 20,
  minOrder: 60,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 12:00-17:00',
  sections: [
    {
      category: 'Günlük Çorba',
      items: [
        { id: 'bk-c1', name: 'Mercimek Çorbası', description: 'Kırmızı mercimek, tereyağı', price: 38, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'bk-c2', name: 'Domates Çorbası', description: 'Kremalı, fesleğenli', price: 38, unit: 'kase', emoji: '🍲' },
        { id: 'bk-c3', name: 'Yayla Çorbası', description: 'Yoğurt + pirinç + nane', price: 38, unit: 'kase', emoji: '🍲', popular: true },
      ],
    },
    {
      category: 'Ana Yemekler',
      items: [
        { id: 'bk-a1', name: 'Etli Kuru Fasulye', description: 'Kemikli dana, geleneksel', price: 88, unit: 'porsiyon', emoji: '🫘', popular: true },
        { id: 'bk-a2', name: 'Musakka', description: 'Patlıcan + kıyma, fırında', price: 95, unit: 'porsiyon', emoji: '🍆', popular: true },
        { id: 'bk-a3', name: 'Bezelye Yemeği', description: 'Zeytinyağlı', price: 72, unit: 'porsiyon', emoji: '🌿' },
        { id: 'bk-a4', name: 'Tavuk Sote', description: 'Biber + domates, pilav eşliğinde', price: 98, unit: 'porsiyon', emoji: '🍗', popular: true },
        { id: 'bk-a5', name: 'Taze Fasulye', description: 'Zeytinyağlı, domates', price: 68, unit: 'porsiyon', emoji: '🫛' },
        { id: 'bk-a6', name: 'Etli Nohut', description: 'Dana küşleme', price: 92, unit: 'porsiyon', emoji: '🫘', popular: true },
      ],
    },
    {
      category: 'Pilav & Makarna',
      items: [
        { id: 'bk-p1', name: 'Pirinç Pilavı', description: 'Tereyağlı', price: 28, unit: 'porsiyon', emoji: '🍚', popular: true },
        { id: 'bk-p2', name: 'Bulgur Pilavı', description: 'Domates sulu', price: 22, unit: 'porsiyon', emoji: '🌾' },
        { id: 'bk-p3', name: 'Şehriye Çorbası', description: 'Tavuk suyu', price: 35, unit: 'porsiyon', emoji: '🍜' },
      ],
    },
    {
      category: 'Tabak Menü',
      items: [
        { id: 'bk-m1', name: 'Günlük Menü', description: 'Çorba + ana yemek + pilav + salata', price: 145, unit: 'menü', emoji: '🍽️', popular: true },
        { id: 'bk-m2', name: 'Yarım Menü', description: 'Ana yemek + pilav', price: 95, unit: 'menü', emoji: '🍽️' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// RECEBİN YERİ ET MANGAL
// ─────────────────────────────────────────────────────────────────────────────

const RECEBIN_YERI: Store = {
  id: 'recebin-yeri',
  name: "Recebin Yeri Et Mangal",
  type: 'restaurant',
  emoji: '🔥',
  tagline: 'Köy usulü mangal · Odun ateşi · Saç kavurma',
  rating: 4.4,
  etaMin: 30,
  minOrder: 100,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Mangal',
      items: [
        { id: 'ry-1', name: 'Köy Köftesi', description: 'El yapımı, odun ateşi, pide eşliği', price: 185, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'ry-2', name: 'Dana Şiş', description: 'Küp dana, mangal, domates + biber', price: 215, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'ry-3', name: 'Tavuk Kanat Mangal', description: '6 adet, marine edilmiş', price: 178, unit: 'porsiyon', emoji: '🍗', popular: true },
        { id: 'ry-4', name: 'Kuzu Şiş', description: 'Taze kuzu, odun ateşi', price: 245, unit: 'porsiyon', emoji: '🍢' },
        { id: 'ry-5', name: 'Karışık Mangal Tabağı', description: 'Köfte + şiş + kanat, 2 kişilik', price: 425, unit: 'tabak', emoji: '🍽️', popular: true },
      ],
    },
    {
      category: 'Kavurma & Güveç',
      items: [
        { id: 'ry-k1', name: 'Saç Kavurma', description: 'Dana + biber + soğan, sac tava', price: 198, unit: 'porsiyon', emoji: '🍳', popular: true },
        { id: 'ry-k2', name: 'Çömlek Güveç', description: 'Kuzu + sebze, fırın güveç', price: 212, unit: 'güveç', emoji: '🍲', popular: true },
        { id: 'ry-k3', name: 'Ciğer Kavurma', description: 'Tavuk ciğer, sogan + biber', price: 145, unit: 'porsiyon', emoji: '🍳' },
      ],
    },
    {
      category: 'Çorba & Yan',
      items: [
        { id: 'ry-c1', name: 'Mercimek Çorbası', description: 'Kırmızı, tereyağlı', price: 42, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'ry-c2', name: 'Pilav', description: 'Tereyağlı pirinç', price: 35, unit: 'porsiyon', emoji: '🍚' },
        { id: 'ry-c3', name: 'Çoban Salatası', description: 'Taze, bol maydanoz', price: 38, unit: 'kase', emoji: '🥗', popular: true },
        { id: 'ry-c4', name: 'Lavaş Ekmek', description: 'Taze pişmiş', price: 15, unit: 'adet', emoji: '🫓' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MUSTAFA AMCA'NIN YERİ – AMASRA CANLI BALIK
// ─────────────────────────────────────────────────────────────────────────────

const MUSTAFA_AMCA: Store = {
  id: 'mustafa-amca',
  name: "Mustafa Amca'nın Yeri",
  type: 'restaurant',
  emoji: '🐟',
  tagline: 'Canlı balık · Karadeniz usulü · Amasra kıyısı',
  rating: 4.7,
  etaMin: 45,
  minOrder: 150,
  address: 'Küçük Liman Cad. 8, Amasra',
  phone: '+90 378 315 26 06',
  sections: [
    {
      category: 'Taze Balık (günlük)',
      items: [
        { id: 'ma-1', name: 'Hamsi Tava', description: 'Karadeniz hamsisi, mısır unu', price: 148, unit: 'porsiyon', emoji: '🐟', popular: true },
        { id: 'ma-2', name: 'Levrek Izgara', description: 'Taze deniz levreği, 350-400g', price: 285, unit: 'adet', emoji: '🐟', popular: true },
        { id: 'ma-3', name: 'Çupra Izgara', description: 'Deniz çupra, limon + zeytinyağ', price: 265, unit: 'adet', emoji: '🐟', popular: true },
        { id: 'ma-4', name: 'Palamut', description: 'Karadeniz palamutu, sezon (Eylül–Şubat)', price: 155, unit: 'porsiyon', emoji: '🐟' },
        { id: 'ma-5', name: 'İstavrit Tava', description: 'Küçük istavrit, bol limon', price: 112, unit: 'porsiyon', emoji: '🐟', popular: true },
        { id: 'ma-6', name: 'Midye Dolma', description: 'Pilavlı, limonsun', price: 68, unit: '10 adet', emoji: '🦪' },
        { id: 'ma-7', name: 'Karides Sote', description: 'Tereyağ + sarımsak', price: 228, unit: 'porsiyon', emoji: '🦐', popular: true },
      ],
    },
    {
      category: 'Meze',
      items: [
        { id: 'ma-m1', name: 'Deniz Börülcesi', description: 'Zeytinyağlı, Karadeniz mezesi', price: 58, unit: 'kase', emoji: '🌿', popular: true },
        { id: 'ma-m2', name: 'Balık Ezme', description: 'Ton + yeşil biber + domates', price: 65, unit: 'kase', emoji: '🥗' },
        { id: 'ma-m3', name: 'Tarama', description: 'Balık yumurtası, zeytinyağlı', price: 72, unit: 'kase', emoji: '🫙', popular: true },
        { id: 'ma-m4', name: 'Roka Salatası', description: 'Taze roka + nar ekşisi', price: 48, unit: 'kase', emoji: '🥗' },
      ],
    },
    {
      category: 'Çorba & İçecek',
      items: [
        { id: 'ma-c1', name: 'Balık Çorbası', description: 'Taze kemik suyu, yoğunlaştırılmış', price: 68, unit: 'kase', emoji: '🍲', popular: true },
        { id: 'ma-c2', name: 'Mercimek Çorbası', description: 'Kırmızı, tereyağlı', price: 45, unit: 'kase', emoji: '🍲' },
        { id: 'ma-i1', name: 'Çay', description: 'Demlik, sınırsız', price: 15, unit: 'bardak', emoji: '🍵', popular: true },
        { id: 'ma-i2', name: 'Ayran', description: 'Soğuk', price: 22, unit: 'bardak', emoji: '🥛' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MARKETİM SÜPERMARKET
// ─────────────────────────────────────────────────────────────────────────────

const MARKETIM: Store = {
  id: 'marketim',
  name: 'Marketim Süpermarket',
  type: 'supermarket',
  emoji: '🛒',
  tagline: 'Mahalle marketi · 08:00–22:00 · Kartlı ödeme',
  logo: '/logos/marketim.svg',
  bannerColor: '#1E2E8B',
  rating: 4.0,
  etaMin: 18,
  minOrder: 40,
  address: 'Bartın Merkez',
  openingHours: 'Mo-Su 08:00-22:00',
  sections: [
    {
      category: 'Süt & Süt Ürünleri',
      items: [
        { id: 'mt-s1', name: 'Süt 1L', description: 'Tam yağlı', price: 34, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'mt-s2', name: 'Yoğurt 500g', description: 'Süzme', price: 40, unit: 'kase', emoji: '🥛' },
        { id: 'mt-s3', name: 'Kaşar Peyniri 200g', description: 'Dilim', price: 92, unit: 'paket', emoji: '🧀', popular: true },
        { id: 'mt-s4', name: 'Beyaz Peynir 400g', description: 'Tuzlu salamura', price: 118, unit: 'paket', emoji: '🧀' },
        { id: 'mt-s5', name: 'Tereyağı 250g', description: 'Tuzsuz', price: 132, unit: 'paket', emoji: '🧈' },
      ],
    },
    {
      category: 'Ekmek & Unlu',
      items: [
        { id: 'mt-e1', name: 'Ekmek', description: '500g, günlük', price: 12, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'mt-e2', name: 'Tost Ekmeği', description: '12\'li dilim', price: 22, unit: 'paket', emoji: '🍞', popular: true },
        { id: 'mt-e3', name: 'Simit', description: 'Susamlı', price: 10, unit: 'adet', emoji: '🥯', popular: true },
        { id: 'mt-e4', name: 'Poğaça Peynirli', description: 'Taze pişmiş', price: 18, unit: 'adet', emoji: '🥐' },
      ],
    },
    {
      category: 'Temel Gıda',
      items: [
        { id: 'mt-g1', name: 'Makarna 500g', description: 'Spagetti / penne', price: 28, unit: 'paket', emoji: '🍝', popular: true },
        { id: 'mt-g2', name: 'Pirinç 1kg', description: 'Baldo', price: 55, unit: 'paket', emoji: '🌾' },
        { id: 'mt-g3', name: 'Un 1kg', description: 'Buğday unu', price: 24, unit: 'paket', emoji: '🌾' },
        { id: 'mt-g4', name: 'Şeker 1kg', description: 'Toz şeker', price: 32, unit: 'paket', emoji: '🍬' },
        { id: 'mt-g5', name: 'Zeytinyağı 0.75L', description: 'Natürel sızma', price: 148, unit: 'şişe', emoji: '🫒', popular: true },
      ],
    },
    {
      category: 'Meyve & Sebze',
      items: [
        { id: 'mt-ms1', name: 'Domates 1kg', description: 'Taze', price: 28, unit: 'kg', emoji: '🍅', popular: true },
        { id: 'mt-ms2', name: 'Salatalık 1kg', description: 'Taze', price: 22, unit: 'kg', emoji: '🥒' },
        { id: 'mt-ms3', name: 'Patates 1kg', description: 'Yerli', price: 18, unit: 'kg', emoji: '🥔', popular: true },
        { id: 'mt-ms4', name: 'Soğan 1kg', description: 'Kuru soğan', price: 15, unit: 'kg', emoji: '🧅' },
        { id: 'mt-ms5', name: 'Elma 1kg', description: 'Starking / golden', price: 32, unit: 'kg', emoji: '🍎' },
        { id: 'mt-ms6', name: 'Muz 1kg', description: 'Ekvador', price: 38, unit: 'kg', emoji: '🍌', popular: true },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'mt-i1', name: 'Su 0.5L', description: '6\'lı koli', price: 28, unit: 'koli', emoji: '💧', popular: true },
        { id: 'mt-i2', name: 'Kola 2.5L', description: 'Büyük şişe', price: 45, unit: 'şişe', emoji: '🥤' },
        { id: 'mt-i3', name: 'Meyve Suyu 1L', description: 'Şeftali / elma / vişne', price: 38, unit: 'şişe', emoji: '🧃', popular: true },
        { id: 'mt-i4', name: 'Çay 500g', description: 'Rize çayı', price: 88, unit: 'paket', emoji: '🍵', popular: true },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TÜRKİYE TARIM KREDİ KOOPERATİF MARKET
// ─────────────────────────────────────────────────────────────────────────────

const TARIM_KREDI: Store = {
  id: 'tarim-kredi',
  name: 'Tarım Kredi Kooperatif Market',
  type: 'supermarket',
  emoji: '🌾',
  tagline: 'Üretici doğrudan · Organik & yerel ürünler · Uygun fiyat',
  rating: 4.2,
  logo: 'https://logo.clearbit.com/tarimkredikoop.org.tr',
  bannerColor: '#2E7D32',
  etaMin: 22,
  minOrder: 50,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Kuru Gıda & Tahıl',
      items: [
        { id: 'tk-1', name: 'Yerli Buğday Unu 5kg', description: 'Değirmenden taze öğütülmüş', price: 98, unit: 'torba', emoji: '🌾', popular: true },
        { id: 'tk-2', name: 'Yerli Mısır Unu 1kg', description: 'Karadeniz usulü', price: 28, unit: 'paket', emoji: '🌽', popular: true },
        { id: 'tk-3', name: 'Kuru Fasulye 1kg', description: 'Yerli bölgesel', price: 65, unit: 'paket', emoji: '🫘', popular: true },
        { id: 'tk-4', name: 'Nohut 1kg', description: 'Doğal', price: 58, unit: 'paket', emoji: '🫘' },
        { id: 'tk-5', name: 'Kırmızı Mercimek 1kg', description: 'Yerli', price: 52, unit: 'paket', emoji: '🟠' },
        { id: 'tk-6', name: 'Bulgur 1kg', description: 'Köy usulü, iri', price: 38, unit: 'paket', emoji: '🌾' },
      ],
    },
    {
      category: 'Sıvıyağ & Süt Ürünleri',
      items: [
        { id: 'tk-y1', name: 'Ayçiçek Yağı 5L', description: 'Kooperatif üretimi', price: 268, unit: 'bidon', emoji: '🌻', popular: true },
        { id: 'tk-y2', name: 'Zeytinyağı 1L', description: 'Ege kökenli, soğuk sıkım', price: 195, unit: 'şişe', emoji: '🫒', popular: true },
        { id: 'tk-s1', name: 'Tam Yağlı Süt 1L', description: 'Çiftçiden taze, günlük', price: 35, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'tk-s2', name: 'Köy Yoğurdu 1kg', description: 'Tam yağlı, katkısız', price: 78, unit: 'kova', emoji: '🥛', popular: true },
        { id: 'tk-s3', name: 'Kaymak 200g', description: 'Taze, süt kaymağı', price: 88, unit: 'kase', emoji: '🥛' },
      ],
    },
    {
      category: 'Bal & Pekmez',
      items: [
        { id: 'tk-b1', name: 'Doğal Süzme Bal 460g', description: 'Karadeniz çiçek balı', price: 228, unit: 'kavanoz', emoji: '🍯', popular: true },
        { id: 'tk-b2', name: 'Karadeniz Petek Balı', description: 'Petekli, doğal', price: 285, unit: 'adet', emoji: '🍯' },
        { id: 'tk-b3', name: 'Üzüm Pekmezi 850g', description: 'Doğal, şekersiz', price: 98, unit: 'kavanoz', emoji: '🫙', popular: true },
        { id: 'tk-b4', name: 'Dut Pekmezi 850g', description: 'Bölgesel', price: 88, unit: 'kavanoz', emoji: '🫙' },
        { id: 'tk-b5', name: 'Tahin 350g', description: 'Saf susam, kooperatif', price: 92, unit: 'kavanoz', emoji: '🫙', popular: true },
      ],
    },
    {
      category: 'Meyve & Sebze',
      items: [
        { id: 'tk-ms1', name: 'Domates 1kg', description: 'Çiftçiden taze, organik', price: 32, unit: 'kg', emoji: '🍅', popular: true },
        { id: 'tk-ms2', name: 'Patates 5kg', description: 'Yerli toprak patates', price: 75, unit: 'koli', emoji: '🥔', popular: true },
        { id: 'tk-ms3', name: 'Soğan 3kg', description: 'Kuru', price: 35, unit: 'torba', emoji: '🧅' },
        { id: 'tk-ms4', name: 'Elma 1kg', description: 'Bölgesel, taze', price: 28, unit: 'kg', emoji: '🍎' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BARTIN HALK EKMEK
// ─────────────────────────────────────────────────────────────────────────────

const HALK_EKMEK: Store = {
  id: 'halk-ekmek',
  name: 'Bartın Halk Ekmek',
  type: 'bakery',
  emoji: '🍞',
  tagline: 'Belediye fırını · Uygun fiyat · Günlük taze',
  bannerColor: '#8B6914',
  rating: 4.0,
  etaMin: 15,
  minOrder: 20,
  address: 'Bartın Belediyesi, Merkez',
  sections: [
    {
      category: 'Ekmek',
      items: [
        { id: 'he-1', name: 'Ekmek', description: '500g, beyaz buğday', price: 10, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'he-2', name: 'Kepekli Ekmek', description: '500g, tam buğday', price: 12, unit: 'adet', emoji: '🍞', popular: true },
        { id: 'he-3', name: 'Büyük Ekmek', description: '750g, aile boyu', price: 14, unit: 'adet', emoji: '🍞' },
        { id: 'he-4', name: 'Somun Ekmek', description: 'Küçük boy, sandviçlik', price: 8, unit: 'adet', emoji: '🥖', popular: true },
      ],
    },
    {
      category: 'Fırın Ürünleri',
      items: [
        { id: 'he-f1', name: 'Simit', description: 'Susamlı, günlük taze', price: 10, unit: 'adet', emoji: '🥯', popular: true },
        { id: 'he-f2', name: 'Pide', description: 'Ramazan pidesi, susamlı', price: 18, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'he-f3', name: 'Açık Pide', description: 'Yağlı, sodalı', price: 16, unit: 'adet', emoji: '🫓' },
        { id: 'he-f4', name: 'Poğaça Peynirli', description: 'Taze pişmiş', price: 18, unit: 'adet', emoji: '🥐', popular: true },
        { id: 'he-f5', name: 'Poğaça Sade', description: 'Yağlı, tereyağlı', price: 14, unit: 'adet', emoji: '🥐' },
        { id: 'he-f6', name: 'Çörek', description: 'Haşhaşlı / susam', price: 16, unit: 'adet', emoji: '🫙' },
      ],
    },
    {
      category: 'Pasta & Tatlı',
      items: [
        { id: 'he-t1', name: 'Kek Dilimi', description: 'Limonlu / kakaolu, günlük', price: 25, unit: 'dilim', emoji: '🎂', popular: true },
        { id: 'he-t2', name: 'Börek', description: 'Peynirli veya patatesli', price: 22, unit: 'dilim', emoji: '🫓', popular: true },
        { id: 'he-t3', name: 'Çikolatalı Kek', description: 'Bütün, 6 dilim', price: 88, unit: 'adet', emoji: '🍫' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BARTINLI ECZANE
// ─────────────────────────────────────────────────────────────────────────────

const ECZANE: Store = {
  id: 'eczane',
  name: 'Bartınlı Eczane',
  type: 'pharmacy',
  emoji: '💊',
  tagline: 'Eczane teslimat · Reçetesiz ilaç · 7/24 acil',
  bannerColor: '#00897B',
  rating: 4.5,
  etaMin: 25,
  minOrder: 30,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Ağrı Kesici & Ateş Düşürücü',
      items: [
        { id: 'ec-1', name: 'Parol 500mg 20 Tablet', description: 'Parasetamol, ağrı + ateş', price: 42, unit: 'kutu', emoji: '💊', popular: true },
        { id: 'ec-2', name: 'Nurofen 400mg 20 Tablet', description: 'İbuprofen, ağrı + yangı', price: 58, unit: 'kutu', emoji: '💊', popular: true },
        { id: 'ec-3', name: 'Apranax 550mg 10 Tablet', description: 'Naproksen, ağrı kesici', price: 55, unit: 'kutu', emoji: '💊' },
        { id: 'ec-4', name: 'Saridon 12 Tablet', description: 'Baş ağrısı özel formül', price: 48, unit: 'kutu', emoji: '💊', popular: true },
        { id: 'ec-5', name: 'Voltaren Jel 100g', description: 'Topikal ağrı jeli', price: 128, unit: 'tüp', emoji: '🧴', popular: true },
      ],
    },
    {
      category: 'Soğuk Algınlığı & Grip',
      items: [
        { id: 'ec-g1', name: 'Gripend 10 Tablet', description: 'Grip belirtileri, çoklu etki', price: 48, unit: 'kutu', emoji: '💊', popular: true },
        { id: 'ec-g2', name: 'Parasinus 10 Tablet', description: 'Sinüzit + baş ağrısı', price: 45, unit: 'kutu', emoji: '💊' },
        { id: 'ec-g3', name: 'Vicks Öksürük Şurubu 120ml', description: 'Balgamlı öksürük', price: 68, unit: 'şişe', emoji: '🍶', popular: true },
        { id: 'ec-g4', name: 'Septofort Pastil 24 Adet', description: 'Boğaz ağrısı', price: 52, unit: 'kutu', emoji: '💊' },
      ],
    },
    {
      category: 'Vitamin & Takviye',
      items: [
        { id: 'ec-v1', name: 'Redoxon C Vitamini 1000mg', description: '30 efervesan tablet', price: 148, unit: 'kutu', emoji: '🟡', popular: true },
        { id: 'ec-v2', name: 'Supradyn Enerji 30 Tablet', description: 'Multivitamin & mineral', price: 168, unit: 'kutu', emoji: '💊', popular: true },
        { id: 'ec-v3', name: 'D Vitamini 1000 IU', description: '90 tablet', price: 98, unit: 'kutu', emoji: '☀️', popular: true },
        { id: 'ec-v4', name: 'Magnezyum 30 Tablet', description: 'Kas krampi için', price: 88, unit: 'kutu', emoji: '💊' },
        { id: 'ec-v5', name: 'Omega-3 30 Kapsül', description: 'Balık yağı', price: 125, unit: 'kutu', emoji: '💊' },
      ],
    },
    {
      category: 'İlk Yardım',
      items: [
        { id: 'ec-j1', name: 'Betadine Antiseptik 30ml', description: 'Yara temizleme, povidon iyot', price: 68, unit: 'şişe', emoji: '🟤', popular: true },
        { id: 'ec-j2', name: 'Yara Bandı 10 Adet', description: 'Karışık boy', price: 28, unit: 'kutu', emoji: '🩹', popular: true },
        { id: 'ec-j3', name: 'Gazlı Bez 10×10cm 10\'lu', description: 'Steril', price: 22, unit: 'paket', emoji: '🩹' },
        { id: 'ec-j4', name: 'Elastik Bandaj 8cm', description: 'Burkulma & baskı için', price: 38, unit: 'adet', emoji: '🩹' },
        { id: 'ec-j5', name: 'D-Panthenol Krem 100g', description: 'Yara iyileştirici', price: 88, unit: 'tüp', emoji: '🧴', popular: true },
      ],
    },
    {
      category: 'Bebek & Çocuk',
      items: [
        { id: 'ec-b1', name: 'Pampers Bezi M 52\'li', description: 'Bebek bezi, 6-11 kg', price: 228, unit: 'paket', emoji: '👶', popular: true },
        { id: 'ec-b2', name: 'Pampers Bezi L 44\'lü', description: 'Bebek bezi, 9-14 kg', price: 228, unit: 'paket', emoji: '👶' },
        { id: 'ec-b3', name: "Johnson's Bebek Şampuanı 300ml", description: 'Göz yakmaz formül', price: 85, unit: 'şişe', emoji: '🍼', popular: true },
        { id: 'ec-b4', name: 'Sudocrem 250g', description: 'Pişik önleyici krem', price: 128, unit: 'kap', emoji: '🧴', popular: true },
      ],
    },
    {
      category: 'Cilt & Kişisel Bakım',
      items: [
        { id: 'ec-c1', name: 'Güneş Koruyucu SPF50 50ml', description: 'UVA/UVB koruması', price: 135, unit: 'tüp', emoji: '☀️', popular: true },
        { id: 'ec-c2', name: 'El Dezenfektanı 100ml', description: '%70 alkol', price: 35, unit: 'şişe', emoji: '🧴', popular: true },
        { id: 'ec-c3', name: 'Nemlendirici Krem 75ml', description: 'Kuru cilt, E vitamini', price: 65, unit: 'tüp', emoji: '🧴' },
        { id: 'ec-c4', name: 'Dudak Balsamı SPF15', description: 'Koruyucu & nemlendirici', price: 42, unit: 'adet', emoji: '💋' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// YEMEKSEPETI BARTИН – eklenen restoranlar
// ─────────────────────────────────────────────────────────────────────────────

const COBAN_KATIK_DONER: Store = {
  id: 'coban-katik-doner',
  name: 'Çoban Katık Döner',
  type: 'fast_food',
  emoji: '🌯',
  tagline: '5.0 puan · Bartın\'ın efsane dönerci · Katık soslu',
  bannerColor: '#C62828',
  rating: 4.9,
  etaMin: 22,
  minOrder: 0,
  address: 'Kemer Köprü Mah., Şadırvan Cad., Bartın',
  sections: [
    {
      category: 'Dürümler',
      items: [
        { id: 'cd-1', name: 'Tavuk Döner Dürüm', description: 'Izgara tavuk döner, özel katık sosu, lavaş', price: 175, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'cd-2', name: 'Et Döner Dürüm', description: 'Dana et, lavaş, roka, domates, soğan', price: 245, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'cd-3', name: 'Katık Özel Dürüm', description: 'Et döner + özel katık + acı biber sosu', price: 265, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'cd-4', name: 'Tavuk Ekmek Arası', description: 'Somun ekmeğinde tavuk döner', price: 140, unit: 'adet', emoji: '🥙' },
        { id: 'cd-5', name: 'Et Ekmek Arası', description: 'Somun ekmeğinde et döner', price: 195, unit: 'adet', emoji: '🥙' },
        { id: 'cd-6', name: 'Zurna Tavuk', description: 'XL boy lavaş dürüm, tavuk', price: 210, unit: 'adet', emoji: '🌯' },
        { id: 'cd-7', name: 'Zurna Et', description: 'XL boy lavaş dürüm, et döner', price: 295, unit: 'adet', emoji: '🌯' },
      ],
    },
    {
      category: 'Menüler & Porsiyon',
      items: [
        { id: 'cd-m1', name: 'Tavuk Porsiyon', description: 'Tavuk döner + pilav', price: 260, unit: 'porsiyon', emoji: '🍽️', popular: true },
        { id: 'cd-m2', name: 'Et Porsiyon', description: 'Et döner + pilav', price: 380, unit: 'porsiyon', emoji: '🍽️' },
        { id: 'cd-m3', name: 'Çoban Menü (Tavuk Dürüm)', description: 'Tavuk dürüm + patates + ayran/kola', price: 260, unit: 'menü', emoji: '🍽️', popular: true },
        { id: 'cd-m4', name: 'Çoban Menü (Et Dürüm)', description: 'Et dürüm + patates + ayran/kola', price: 330, unit: 'menü', emoji: '🍽️' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'cd-i1', name: 'Ayran', description: 'Soğuk, köpüklü', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'cd-i2', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'cd-i3', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const CIZZGARA: Store = {
  id: 'cizzgara',
  name: 'Cızzgara Kebap & Pilav & Kokoreç',
  type: 'restaurant',
  emoji: '🥩',
  tagline: '5.0 puan · Cızzgara izgara · Pilav yanında',
  bannerColor: '#BF360C',
  rating: 4.9,
  etaMin: 28,
  minOrder: 0,
  address: 'Kemer Köprü Mah., Bartın',
  sections: [
    {
      category: 'Izgara Çeşitleri',
      items: [
        { id: 'cg-1', name: 'Adana Kebap', description: 'Acılı kıyma, lavaş, közlenmiş biber + domates', price: 250, unit: 'porsiyon', emoji: '🔥', popular: true },
        { id: 'cg-2', name: 'Urfa Kebap', description: 'Sade kıyma, sumaklı soğan, maydanoz', price: 245, unit: 'porsiyon', emoji: '🔥' },
        { id: 'cg-3', name: 'Tavuk Şiş', description: 'Marine edilmiş tavuk, közlenmiş sebze, pilav', price: 225, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'cg-4', name: 'Izgara Köfte', description: '4 köfte, piyaz, pilav', price: 230, unit: 'porsiyon', emoji: '🍢' },
        { id: 'cg-5', name: 'Karışık Izgara', description: 'Adana + tavuk şiş + köfte, pilav ile', price: 330, unit: 'porsiyon', emoji: '🍽️', popular: true },
      ],
    },
    {
      category: 'Kokoreç',
      items: [
        { id: 'cg-6', name: 'Kokoreç Tam Ekmek', description: 'Kekikli, kıyık veya ince, tam somun', price: 160, unit: 'adet', emoji: '🥖', popular: true },
        { id: 'cg-7', name: 'Kokoreç Yarım', description: 'Yarım somun', price: 95, unit: 'adet', emoji: '🥖' },
      ],
    },
    {
      category: 'Pilav & İçecek',
      items: [
        { id: 'cg-8', name: 'Tereyağlı Pilav', description: 'Bütün pilav, tereyağlı', price: 75, unit: 'kase', emoji: '🍚' },
        { id: 'cg-9', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'cg-10', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const EMIR_PIDE: Store = {
  id: 'emir-pide',
  name: 'Emir Karadeniz Pide',
  type: 'restaurant',
  emoji: '🫓',
  tagline: '5.0 puan · Karadeniz usulü taş fırın pide',
  bannerColor: '#E65100',
  rating: 4.9,
  etaMin: 25,
  minOrder: 0,
  address: 'Hendek Yanı Cad. No:38/A, Orta Mah., Bartın',
  sections: [
    {
      category: 'Pide Çeşitleri',
      items: [
        { id: 'ep-1', name: 'Kıymalı Pide', description: 'Dana kıyma, soğan, biber – Karadeniz usulü', price: 180, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ep-2', name: 'Kaşarlı Pide', description: 'Erimiş kaşar, tereyağı', price: 165, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ep-3', name: 'Yumurtalı Kaşarlı Pide', description: 'Kaşar + yumurta, taş fırın', price: 175, unit: 'adet', emoji: '🫓' },
        { id: 'ep-4', name: 'Kuşbaşılı Kaşarlı Pide', description: 'Kuşbaşı et, biber, domates', price: 225, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ep-5', name: 'Kavurmalı Karadeniz Pidesi', description: 'Kavurma et, tereyağı, taş fırın', price: 240, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ep-6', name: 'Karışık Pide', description: 'Kıyma + kaşar + yumurta', price: 200, unit: 'adet', emoji: '🫓' },
        { id: 'ep-7', name: 'Lahmacun', description: 'İnce, baharatlı kıymalı', price: 80, unit: 'adet', emoji: '🫓' },
      ],
    },
    {
      category: 'Çorba & İçecek',
      items: [
        { id: 'ep-8', name: 'Mercimek Çorbası', description: 'Kırmızı mercimek, limon, nane', price: 65, unit: 'kase', emoji: '🍵' },
        { id: 'ep-9', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'ep-10', name: 'Çay', price: 20, unit: 'bardak', emoji: '🍵' },
        { id: 'ep-11', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const ALI_CHEF: Store = {
  id: 'ali-chef',
  name: 'Ali Chef',
  type: 'restaurant',
  emoji: '👨‍🍳',
  tagline: '4.9 puan · Usta elinden Türk mutfağı',
  bannerColor: '#1A237E',
  rating: 4.9,
  etaMin: 30,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Kebap & Izgara',
      items: [
        { id: 'ac-1', name: 'Şiş Kebap Porsiyonu', description: 'Dana şiş, pilav, cacık, közlenmiş sebze', price: 285, unit: 'porsiyon', emoji: '🍢', popular: true },
        { id: 'ac-2', name: 'Adana Kebap', description: 'Acılı iri kıyma kebabı, lavaş, nar ekşili soğan', price: 270, unit: 'porsiyon', emoji: '🔥', popular: true },
        { id: 'ac-3', name: 'Urfa Kebap', description: 'Sade kıyma, sumaklı soğan', price: 265, unit: 'porsiyon', emoji: '🔥' },
        { id: 'ac-4', name: 'Tavuk Beyti', description: 'Sarımsaklı tavuk, lavaş, domates sos', price: 245, unit: 'porsiyon', emoji: '🌯', popular: true },
        { id: 'ac-5', name: 'Karışık Izgara', description: 'Adana + şiş + köfte, pilav + salata', price: 370, unit: 'porsiyon', emoji: '🍽️', popular: true },
      ],
    },
    {
      category: 'Meze & Çorba',
      items: [
        { id: 'ac-6', name: 'Cacık', description: 'Yoğurt, salatalık, nane', price: 55, unit: 'kase', emoji: '🥣' },
        { id: 'ac-7', name: 'Ezme Salata', description: 'Acı biber, domates, maydanoz', price: 60, unit: 'tabak', emoji: '🥗' },
        { id: 'ac-8', name: 'İşkembe Çorbası', description: 'Sarımsaklı, limonlu', price: 80, unit: 'kase', emoji: '🍵' },
        { id: 'ac-9', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'ac-10', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const KARADENIZ_BALIK: Store = {
  id: 'karadeniz-balik',
  name: 'Karadeniz Balıkçısı',
  type: 'restaurant',
  emoji: '🐟',
  tagline: '4.5 puan · Taze Karadeniz balığı · Günlük geliyor',
  bannerColor: '#01579B',
  rating: 4.5,
  etaMin: 35,
  minOrder: 100,
  address: 'Bartın Çayı kıyısı, Bartın',
  sections: [
    {
      category: 'Dürüm & Ekmek Arası',
      items: [
        { id: 'kb-d1', name: 'Hamsi Dürüm', description: 'Karadeniz hamsisi, mısır unu, lavaş', price: 180, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'kb-d2', name: 'Balık Ekmek', description: 'Izgara balık, somun, domates, salata', price: 175, unit: 'adet', emoji: '🥙', popular: true },
        { id: 'kb-d3', name: 'Uskumru Dürüm', description: 'Izgara uskumru, lavaş, soğan', price: 190, unit: 'adet', emoji: '🌯' },
      ],
    },
    {
      category: 'Kiloluk Tavada Balık',
      items: [
        { id: 'kb-1', name: 'Hamsi Tava (1kg)', description: 'Karadeniz hamsisi, mısır unu, taze limon', price: 350, unit: 'kg', emoji: '🐟', popular: true },
        { id: 'kb-2', name: 'İstavrit Tava (1kg)', description: 'Kızarmış istavrit, hafif baharatlı', price: 310, unit: 'kg', emoji: '🐟' },
        { id: 'kb-3', name: 'Levrek Izgara', description: 'Taze levrek ~400g, limon, zeytinyağı', price: 350, unit: 'adet', emoji: '🐠', popular: true },
        { id: 'kb-4', name: 'Çipura Izgara', description: 'Taze çipura ~350g, kekik, limon', price: 320, unit: 'adet', emoji: '🐡' },
        { id: 'kb-5', name: 'Kalkan Buğulama', description: 'Karadeniz kalkanu, sebzeli buğulama', price: 420, unit: 'porsiyon', emoji: '🐟', popular: true },
      ],
    },
    {
      category: 'Meze & Salata',
      items: [
        { id: 'kb-6', name: 'Deniz Börülcesi', description: 'Zeytinyağlı, hafif tuzlu Karadeniz mezesi', price: 80, unit: 'kase', emoji: '🌿', popular: true },
        { id: 'kb-7', name: 'Tarator Sos', description: 'Cevizli, sarımsaklı balık mezesi', price: 75, unit: 'kase', emoji: '🥣' },
        { id: 'kb-8', name: 'Yeşil Salata', price: 70, unit: 'tabak', emoji: '🥗' },
        { id: 'kb-9', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'kb-10', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const SURA_TATLI: Store = {
  id: 'sura-tatli',
  name: 'Şura Tatlı & Profiterol',
  type: 'cafe',
  emoji: '🍮',
  tagline: '4.5 puan · El yapımı profiterol · Günlük tatlılar',
  bannerColor: '#880E4F',
  rating: 4.5,
  etaMin: 20,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Profiterol & Tatlılar',
      items: [
        { id: 'st-1', name: 'Profiterol', description: 'El yapımı, çikolatalı sos, fındık', price: 110, unit: 'porsiyon', emoji: '🍮', popular: true },
        { id: 'st-2', name: 'Kazandibi', description: 'Geleneksel muhallebi tatlısı, altı karamelize', price: 85, unit: 'dilim', emoji: '🍮', popular: true },
        { id: 'st-3', name: 'Sütlaç', description: 'Fırında üzeri kızarmış', price: 80, unit: 'kase', emoji: '🍮' },
        { id: 'st-4', name: 'Aşure', description: 'Tahıllı, kuruyemişli geleneksel', price: 75, unit: 'kase', emoji: '🫙' },
        { id: 'st-5', name: 'Baklava (3 dilim)', description: 'Antep fıstıklı, tereyağlı şerbetli', price: 145, unit: 'tabak', emoji: '🍯', popular: true },
        { id: 'st-9', name: 'Künefe', description: 'Tel kadayıf, tuzsuz peynir, şerbet', price: 135, unit: 'porsiyon', emoji: '🧀', popular: true },
        { id: 'st-10', name: 'Muhallebi', description: 'Sıvı muhallebi, gülsuyu', price: 75, unit: 'kase', emoji: '🍮' },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: 'st-6', name: 'Türk Kahvesi', price: 55, unit: 'fincan', emoji: '☕' },
        { id: 'st-7', name: 'Salep', description: 'Sıcak, tarçınlı', price: 65, unit: 'bardak', emoji: '🍵' },
        { id: 'st-8', name: 'Çay', price: 20, unit: 'bardak', emoji: '🍵' },
        { id: 'st-11', name: 'Limonata', description: 'Taze sıkılmış', price: 65, unit: 'bardak', emoji: '🍋' },
      ],
    },
  ],
};

const BEYSOS_DONER: Store = {
  id: 'beysos-doner',
  name: 'Beysos Döner',
  type: 'fast_food',
  emoji: '🌯',
  tagline: '4.4 puan · Özel baharatlı et döner · beysosdoner.com',
  bannerColor: '#D84315',
  rating: 4.4,
  etaMin: 20,
  minOrder: 0,
  address: 'Gazipaşa Cad., Bartın Merkez',
  sections: [
    {
      category: 'Tavuk Dürüm',
      items: [
        { id: 'bd-t1', name: 'Tavuk Dürüm Küçük', description: 'Marine tavuk döner, lavaş, taze sebze', price: 175, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'bd-t2', name: 'Tavuk Dürüm Orta', price: 205, unit: 'adet', emoji: '🌯' },
        { id: 'bd-t3', name: 'Tavuk Dürüm Büyük', price: 235, unit: 'adet', emoji: '🌯' },
        { id: 'bd-t4', name: 'Tavuk Dürüm XL', price: 270, unit: 'adet', emoji: '🌯' },
      ],
    },
    {
      category: 'Et Dürüm',
      items: [
        { id: 'bd-e1', name: 'Et Dürüm Küçük', description: 'Dana et döner, özel baharatlar, lavaş', price: 245, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'bd-e2', name: 'Et Dürüm Orta', price: 290, unit: 'adet', emoji: '🌯' },
        { id: 'bd-e3', name: 'Et Dürüm Büyük', price: 350, unit: 'adet', emoji: '🌯' },
        { id: 'bd-e4', name: 'Et Dürüm XL', price: 395, unit: 'adet', emoji: '🌯' },
      ],
    },
    {
      category: 'Burger & Tombik',
      items: [
        { id: 'bd-b1', name: 'Tavuk Döner Burger', description: 'Brioche bun, tavuk döner, özel sos', price: 185, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'bd-b2', name: 'Et Döner Burger', description: 'Brioche bun, et döner, kaşar', price: 250, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'bd-b3', name: 'Tombik Tavuk', description: 'Küçük tombik ekmek, tavuk döner', price: 160, unit: 'adet', emoji: '🥙' },
        { id: 'bd-b4', name: 'Tombik Et', description: 'Küçük tombik ekmek, et döner', price: 240, unit: 'adet', emoji: '🥙' },
      ],
    },
    {
      category: 'Porsiyon & İskender',
      items: [
        { id: 'bd-p1', name: 'Tavuk Porsiyon', description: 'Tavuk döner tabağı, pilav, salata', price: 250, unit: 'porsiyon', emoji: '🍽️', popular: true },
        { id: 'bd-p2', name: 'Et Porsiyon', description: 'Et döner tabağı, pilav, salata', price: 390, unit: 'porsiyon', emoji: '🍽️' },
        { id: 'bd-p3', name: 'İskender Tavuk', description: 'Tereyağlı domates sos, yoğurt, pide', price: 335, unit: 'porsiyon', emoji: '🍽️', popular: true },
        { id: 'bd-p4', name: 'İskender Et', description: 'Tereyağlı domates sos, yoğurt, pide', price: 455, unit: 'porsiyon', emoji: '🍽️' },
        { id: 'bd-p5', name: 'Beyti Tavuk', description: 'Lavaşta sarılmış, domates sos', price: 350, unit: 'porsiyon', emoji: '🌯' },
        { id: 'bd-p6', name: 'Beyti Et', description: 'Lavaşta sarılmış, domates sos', price: 475, unit: 'porsiyon', emoji: '🌯' },
      ],
    },
    {
      category: 'Yan Ürünler',
      items: [
        { id: 'bd-y1', name: 'Külah Patates', description: 'Küçük kıtır patates', price: 80, unit: 'adet', emoji: '🍟', popular: true },
        { id: 'bd-y2', name: 'Porsiyon Patates', price: 150, unit: 'porsiyon', emoji: '🍟' },
        { id: 'bd-y3', name: 'Soğan Halkası 6\'lı', price: 75, unit: 'porsiyon', emoji: '🧅' },
        { id: 'bd-y4', name: 'Nugget 6\'lı', price: 75, unit: 'porsiyon', emoji: '🍗' },
        { id: 'bd-y5', name: 'Tatlı (Kazandibi/Profiterol/Sütlaç)', price: 70, unit: 'adet', emoji: '🍮' },
      ],
    },
    {
      category: 'İçecekler',
      items: [
        { id: 'bd-i1', name: 'Ayran 175ml', price: 45, unit: 'şişe', emoji: '🥛', popular: true },
        { id: 'bd-i2', name: 'Ayran 275ml', price: 50, unit: 'şişe', emoji: '🥛' },
        { id: 'bd-i3', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'bd-i4', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const YOREM_GOZLEME: Store = {
  id: 'yorem-gozleme',
  name: 'Yörem Gözleme & Cafe',
  type: 'cafe',
  emoji: '🥞',
  tagline: '4.4 puan · El açması gözleme · Köy kahvaltısı',
  bannerColor: '#558B2F',
  rating: 4.4,
  etaMin: 25,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Gözleme Çeşitleri',
      items: [
        { id: 'yg-1', name: 'Peynirli Gözleme', description: 'El açması, taze beyaz peynir', price: 120, unit: 'adet', emoji: '🥞', popular: true },
        { id: 'yg-2', name: 'Patatesli Gözleme', description: 'Haşlanmış patates, taze soğan, tereyağı', price: 115, unit: 'adet', emoji: '🥞', popular: true },
        { id: 'yg-3', name: 'Ispanaklı Gözleme', description: 'Ispanak, lor peyniri', price: 120, unit: 'adet', emoji: '🥞' },
        { id: 'yg-4', name: 'Kıymalı Gözleme', description: 'Dana kıyma, soğan, baharat', price: 135, unit: 'adet', emoji: '🥞', popular: true },
        { id: 'yg-8', name: 'Kaşarlı Gözleme', description: 'Erimiş kaşar peyniri', price: 125, unit: 'adet', emoji: '🥞' },
        { id: 'yg-9', name: 'Çift Peynirli Gözleme', description: 'Beyaz peynir + kaşar karışım', price: 140, unit: 'adet', emoji: '🥞', popular: true },
      ],
    },
    {
      category: 'Kahvaltı & Atıştırmalık',
      items: [
        { id: 'yg-5', name: 'Menemen', description: 'Domates, biber, yumurta, tereyağı', price: 100, unit: 'porsiyon', emoji: '🍳', popular: true },
        { id: 'yg-10', name: 'Sahanda Yumurta', description: 'Tereyağlı, sucuklu', price: 95, unit: 'porsiyon', emoji: '🍳' },
        { id: 'yg-11', name: 'Börek (1 dilim)', description: 'Peynirli veya ıspanaklı', price: 80, unit: 'dilim', emoji: '🥐' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'yg-6', name: 'Çay (çift çay)', price: 20, unit: 'bardak', emoji: '🍵', popular: true },
        { id: 'yg-7', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'yg-12', name: 'Türk Kahvesi', price: 55, unit: 'fincan', emoji: '☕' },
        { id: 'yg-13', name: 'Neskafe', price: 60, unit: 'bardak', emoji: '☕' },
      ],
    },
  ],
};

const ANTEPLI_PIDE: Store = {
  id: 'antepli-pide',
  name: 'Antepli Acıktım Pide',
  type: 'restaurant',
  emoji: '🫓',
  tagline: '4.8 puan · Gaziantep usulü pide · 5000+ yorum',
  bannerColor: '#EF6C00',
  rating: 4.8,
  etaMin: 25,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Pide Çeşitleri',
      items: [
        { id: 'ap-1', name: 'Kıymalı Pide', description: 'İnce açma, dana kıyma, soğan, biber', price: 165, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ap-3', name: 'Kaşarlı Pide', description: 'Erimiş kaşar peyniri, tereyağı', price: 160, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ap-8', name: 'Yumurtalı Kaşarlı Pide', description: 'Kaşar + yumurta', price: 170, unit: 'adet', emoji: '🫓' },
        { id: 'ap-9', name: 'Kuşbaşılı Kaşarlı Pide', description: 'Kuşbaşı et + kaşar', price: 225, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ap-10', name: 'Künefe', description: 'Hatay usulü, tel kadayıf, tuzsuz peynir, şerbet', price: 145, unit: 'porsiyon', emoji: '🧀', popular: true },
      ],
    },
    {
      category: 'Lahmacun & Kebap',
      items: [
        { id: 'ap-2', name: 'Lahmacun', description: 'İnce lavaş, baharatlı kıyma', price: 80, unit: 'adet', emoji: '🫓', popular: true },
        { id: 'ap-4', name: 'Kiremitte Kuşbaşı', description: 'Kiremit tavasında kuşbaşı et + biber + domates', price: 265, unit: 'porsiyon', emoji: '🍳', popular: true },
        { id: 'ap-11', name: 'Adana Kebap', description: 'Acılı kıyma kebabı, lavaş', price: 260, unit: 'porsiyon', emoji: '🔥' },
      ],
    },
    {
      category: 'Çorba & İçecek',
      items: [
        { id: 'ap-5', name: 'Ezogelin Çorba', price: 65, unit: 'kase', emoji: '🍵' },
        { id: 'ap-6', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'ap-7', name: 'Şalgam', description: 'Acı veya sade', price: 40, unit: 'bardak', emoji: '🍹' },
        { id: 'ap-12', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const BIBBER_PIZZA: Store = {
  id: 'bibber-pizza',
  name: 'Bibber Pizzeria',
  type: 'fast_food',
  emoji: '🍕',
  tagline: '4.7 puan · El yapımı İtalyan hamuru · Fırın pizzası',
  bannerColor: '#B71C1C',
  rating: 4.7,
  etaMin: 28,
  minOrder: 0,
  address: 'Asma Cd. No:2A, Bartın Merkez',
  sections: [
    {
      category: 'Pizzalar (26 cm)',
      items: [
        { id: 'bp-1', name: 'Margarita', description: 'Domates sosu, mozzarella, fesleğen', price: 220, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'bp-2', name: 'Karışık Pizza', description: 'Sucuk, mantar, biber, mısır, kaşar', price: 260, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'bp-3', name: 'Mantarlı Pizza', description: 'Taze mantar, kaşar, kekik, soğan', price: 245, unit: 'adet', emoji: '🍕' },
        { id: 'bp-4', name: 'Sucuklu Pizza', description: 'Türk sucuğu, mozzarella, biber', price: 250, unit: 'adet', emoji: '🍕', popular: true },
        { id: 'bp-8', name: 'Tavuklu Pizza', description: 'Izgara tavuk, mısır, kaşar, domates', price: 255, unit: 'adet', emoji: '🍕' },
        { id: 'bp-9', name: 'Dört Peynirli Pizza', description: 'Mozzarella, kaşar, gouda, rokfor', price: 270, unit: 'adet', emoji: '🍕', popular: true },
      ],
    },
    {
      category: 'Ek & İçecek',
      items: [
        { id: 'bp-5', name: 'Sarımsaklı Ekmek', description: 'Tereyağlı, otlu', price: 75, unit: 'adet', emoji: '🥖' },
        { id: 'bp-10', name: 'Mozzarella Çubukları (5 adet)', description: 'Domates sosu ile', price: 120, unit: 'porsiyon', emoji: '🧀', popular: true },
        { id: 'bp-6', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'bp-7', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'bp-11', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const UMUT_BURGER: Store = {
  id: 'umut-burger',
  name: 'Umut Burger',
  type: 'fast_food',
  emoji: '🍔',
  tagline: '5.0 puan · El yapımı köfte · Ev yapımı sos',
  bannerColor: '#212121',
  rating: 4.9,
  etaMin: 22,
  minOrder: 0,
  address: 'Kırtepe Mah., Bartın Merkez',
  sections: [
    {
      category: 'Burgerler',
      items: [
        { id: 'ub-1', name: 'Umut Classic Burger', description: '150g el köfte, kaşar, marul, özel sos', price: 210, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ub-2', name: 'Double Smash Burger', description: '2×100g ince köfte, çift cheddar, turşu, acı biber', price: 265, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ub-3', name: 'Tavuk Burger', description: 'Fileto tavuk, koleslaw, ranch, taze marul', price: 185, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ub-4', name: 'Umut Özel Burger', description: 'Dana + kuzu karışım, karamelize soğan, mantar', price: 285, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ub-8', name: 'Mushroom Burger', description: '150g köfte, çift mantar, trüf sos', price: 240, unit: 'adet', emoji: '🍔' },
      ],
    },
    {
      category: 'Ek & İçecek',
      items: [
        { id: 'ub-5', name: 'Patates Kızartması', description: 'Kıtır, çubuk patates, tuz', price: 90, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'ub-6', name: 'Soğan Halkası', description: '6 adet, ranch sos ile', price: 95, unit: 'porsiyon', emoji: '🧅' },
        { id: 'ub-9', name: 'Coleslaw Salata', description: 'Lahana, havuç, mayonezli sos', price: 65, unit: 'kase', emoji: '🥗' },
        { id: 'ub-7', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'ub-10', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'ub-11', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const SANDWICH_KRALLIGI: Store = {
  id: 'sandwich-kralligi',
  name: 'Sandwich Krallığı',
  type: 'fast_food',
  emoji: '🥪',
  tagline: '5.0 puan · Özel ekmekler · Taze malzeme',
  bannerColor: '#33691E',
  rating: 4.9,
  etaMin: 20,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Sandviçler',
      items: [
        { id: 'sk-1', name: 'King Sandviç', description: 'Dana et, kaşar, turşu, özel ev sosu, marul', price: 195, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'sk-2', name: 'Tavuk Sandviç', description: 'Izgara tavuk, taze sebze, ranch sosu', price: 165, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'sk-8', name: 'Sucuklu Sandviç', description: 'Türk sucuğu, sarımsaklı yoğurt sos, kaşar', price: 175, unit: 'adet', emoji: '🥪', popular: true },
        { id: 'sk-3', name: 'Ton Balıklı Sandviç', description: 'Ton balığı, mısır, yeşil zeytin, kapari', price: 155, unit: 'adet', emoji: '🥪' },
        { id: 'sk-4', name: 'Vejetaryen Sandviç', description: 'Avokado, kaşar, domates, roka', price: 145, unit: 'adet', emoji: '🥪' },
        { id: 'sk-9', name: 'Double King', description: 'Çift katmanlı, 2 kat et, çift kaşar', price: 270, unit: 'adet', emoji: '🥪', popular: true },
      ],
    },
    {
      category: 'Ek & İçecek',
      items: [
        { id: 'sk-5', name: 'Patates Kızartması', description: 'Kıtır ince patates', price: 85, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'sk-10', name: 'Coleslaw', description: 'Kremalı lahana salatası', price: 60, unit: 'kase', emoji: '🥗' },
        { id: 'sk-6', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'sk-7', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'sk-11', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const TATS: Store = {
  id: 'tats',
  name: "Tat's",
  type: 'restaurant',
  emoji: '🍽️',
  tagline: '4.3 puan · Türk mutfağı · 1000+ yorum',
  bannerColor: '#4A148C',
  rating: 4.3,
  etaMin: 30,
  minOrder: 0,
  address: 'Çalıkoğlu Cd. No:15, Kemer Köprü Mah., Bartın',
  sections: [
    {
      category: 'Kebap & Ana Yemekler',
      items: [
        { id: 'ts-1', name: "Tat's Özel Kebap", description: 'Şef usulü karışık kebap, lavaş, cacık', price: 290, unit: 'porsiyon', emoji: '🔥', popular: true },
        { id: 'ts-2', name: 'Çoban Kavurma', description: 'Kuşbaşı et, yeşil biber, domates, sac tavası', price: 275, unit: 'porsiyon', emoji: '🍳', popular: true },
        { id: 'ts-8', name: 'Adana Kebap', description: 'Acılı kıyma, lavaş, közlenmiş biber', price: 265, unit: 'porsiyon', emoji: '🔥' },
        { id: 'ts-3', name: 'Fırın Tavuk (Bütün)', description: 'Baharatlı fırın piliç, kanat + but + göğüs', price: 280, unit: 'adet', emoji: '🍗', popular: true },
        { id: 'ts-4', name: 'Lahmacun (4 adet)', description: 'İnce, baharatlı, limonlu', price: 140, unit: 'porsiyon', emoji: '🫓' },
        { id: 'ts-9', name: 'Pide (Kıymalı)', description: 'Taş fırın, dana kıymalı pide', price: 180, unit: 'adet', emoji: '🫓', popular: true },
      ],
    },
    {
      category: 'Çorba & Meze',
      items: [
        { id: 'ts-5', name: 'Mercimek Çorbası', price: 65, unit: 'kase', emoji: '🍵', popular: true },
        { id: 'ts-6', name: 'Cacık', price: 55, unit: 'kase', emoji: '🥣' },
        { id: 'ts-10', name: 'Çoban Salatası', description: 'Taze, bol maydanoz, narenciye', price: 65, unit: 'tabak', emoji: '🥗' },
        { id: 'ts-7', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'ts-11', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const OZZIE_BURGER: Store = {
  id: 'ozzie-burger',
  name: 'Ozzie Burger',
  type: 'fast_food',
  emoji: '🍔',
  tagline: '4.3 puan · Smash burger uzmanı · Özel Ozzie sos',
  bannerColor: '#E65100',
  rating: 4.3,
  etaMin: 22,
  minOrder: 0,
  address: 'Şadırvan Cd., Kemer Köprü Mah., Bartın',
  sections: [
    {
      category: 'Burgerler',
      items: [
        { id: 'ob-1', name: 'Ozzie Smash Burger', description: '2 ince kat köfte, cheddar, turşu, Ozzie sos, marul', price: 230, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ob-2', name: 'Classic Beef Burger', description: '150g köfte, kaşar, domates, marul', price: 200, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ob-3', name: 'Crispy Chicken Burger', description: 'Kızarmış tavuk fileto, koleslaw, ranch', price: 195, unit: 'adet', emoji: '🍔' },
        { id: 'ob-4', name: 'Mushroom Swiss Burger', description: '150g köfte, mantar, kaşar, özel sos', price: 215, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'ob-8', name: 'Ozzie Special (120g kıyma)', description: 'Özel baharat, kaşar, pastırma, jalapeño, aioli', price: 270, unit: 'adet', emoji: '🍔', popular: true },
      ],
    },
    {
      category: 'Ek & İçecek',
      items: [
        { id: 'ob-5', name: 'Curly Fries', description: 'Bükülü kıtır patates', price: 95, unit: 'porsiyon', emoji: '🍟', popular: true },
        { id: 'ob-6', name: 'Onion Rings (6 adet)', description: 'Çıtır soğan halkası', price: 90, unit: 'porsiyon', emoji: '🧅' },
        { id: 'ob-9', name: 'Jalapeno Bites', description: 'Kızarmış jalapeño, sos', price: 85, unit: 'porsiyon', emoji: '🌶️' },
        { id: 'ob-7', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'ob-10', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
      ],
    },
  ],
};

const URZ_OCAKBASI: Store = {
  id: 'urz-ocakbasi',
  name: 'Urz Ocakbaşı',
  type: 'restaurant',
  emoji: '🔥',
  tagline: '4.2 puan · Cağ kebap ustası · Gerçek ocakbaşı',
  bannerColor: '#3E2723',
  rating: 4.2,
  etaMin: 30,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Cağ Kebap',
      items: [
        { id: 'uo-1', name: 'Cağ Kebap Tam Porsiyon', description: 'Geleneksel şiş, lavaş, piyaz, közlenmiş biber', price: 285, unit: 'porsiyon', emoji: '🔥', popular: true },
        { id: 'uo-2', name: 'Cağ Kebap Yarım', description: 'Yarım porsiyon, lavaş ile', price: 165, unit: 'porsiyon', emoji: '🔥', popular: true },
        { id: 'uo-3', name: 'Cağ Dürüm', description: 'Lavaşta cağ kebap, özel soğan', price: 190, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'uo-4', name: 'Karışık Ocakbaşı Tabağı', description: 'Cağ + köfte + tavuk şiş, pilav', price: 360, unit: 'porsiyon', emoji: '🍽️', popular: true },
        { id: 'uo-8', name: 'Adana Kebap', description: 'Acılı kıyma, lavaş, sumak soğan', price: 270, unit: 'porsiyon', emoji: '🔥' },
        { id: 'uo-9', name: 'Tavuk Şiş', description: 'Marine tavuk, közlenmiş sebze, pilav', price: 240, unit: 'porsiyon', emoji: '🍢' },
      ],
    },
    {
      category: 'Ek & İçecek',
      items: [
        { id: 'uo-5', name: 'Cacık', price: 55, unit: 'kase', emoji: '🥣' },
        { id: 'uo-6', name: 'Közlenmiş Biber & Domates', price: 50, unit: 'tabak', emoji: '🫑' },
        { id: 'uo-10', name: 'Piyaz', description: 'Beyaz fasulye, sumaklı soğan', price: 55, unit: 'tabak', emoji: '🥗' },
        { id: 'uo-7', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'uo-11', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const ASG_DONER: Store = {
  id: 'asg-doner',
  name: 'ASG Katık Döner',
  type: 'fast_food',
  emoji: '🌯',
  tagline: '4.1 puan · Katık döner · 1000+ yorum · %15 indirim',
  bannerColor: '#880000',
  rating: 4.1,
  etaMin: 20,
  minOrder: 0,
  address: 'Bartın Merkez',
  sections: [
    {
      category: 'Dönerler',
      items: [
        { id: 'ag-1', name: 'Katık Tavuk Dürüm', description: 'Tavuk döner, sarımsaklı katık sosu, lavaş', price: 175, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'ag-2', name: 'Katık Et Dürüm', description: 'Dana et döner, yoğurt katık, lavaş', price: 240, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'ag-3', name: 'Tavuk Ekmek Arası', description: 'Somun ekmeğinde tavuk döner + katık', price: 140, unit: 'adet', emoji: '🥙' },
        { id: 'ag-4', name: 'Et Ekmek Arası', description: 'Somun ekmeğinde et döner + katık', price: 195, unit: 'adet', emoji: '🥙' },
        { id: 'ag-7', name: 'Et Döner Porsiyonu', description: 'Pilav + salata ile', price: 310, unit: 'porsiyon', emoji: '🍽️' },
        { id: 'ag-8', name: 'Tavuk Döner Porsiyonu', description: 'Pilav + salata ile', price: 265, unit: 'porsiyon', emoji: '🍽️' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'ag-5', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'ag-6', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'ag-9', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

const BIRADER_WAFFLE: Store = {
  id: 'birader-waffle',
  name: 'Birader Waffle',
  type: 'cafe',
  emoji: '🧇',
  tagline: '4.3 puan · Taze waffle · Kumpir · 1000+ yorum',
  bannerColor: '#F9A825',
  rating: 4.3,
  etaMin: 20,
  minOrder: 0,
  address: 'Kocabekir Sk. No:4, Kırtepe Mah., Bartın',
  sections: [
    {
      category: 'Waffle',
      items: [
        { id: 'bw-1', name: 'Klasik Waffle', description: 'Çikolata sosu, şeker tozu, fıstık', price: 140, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'bw-2', name: 'Nutella Waffle', description: 'Nutella, dilimli muz, fındık', price: 165, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'bw-3', name: 'Meyveli Waffle', description: 'Çilek, vişne, çikolata sosu', price: 160, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'bw-4', name: 'Karamelli Waffle', description: 'Karamel sos, ceviz, dondurma', price: 165, unit: 'adet', emoji: '🧇' },
        { id: 'bw-8', name: 'Bowl Waffle Özel', description: 'Büyük kase waffle, 4 adet topping seçim', price: 200, unit: 'adet', emoji: '🧇', popular: true },
        { id: 'bw-9', name: 'Night Waffle', description: 'Oreo, bitter çikolata, dondurma', price: 195, unit: 'adet', emoji: '🧇' },
      ],
    },
    {
      category: 'Kumpir & Tatlı',
      items: [
        { id: 'bw-10', name: 'Kumpir', description: 'Büyük patates, 3 malzeme seçim, tereyağlı', price: 160, unit: 'adet', emoji: '🥔', popular: true },
        { id: 'bw-11', name: 'Kumpir Süper', description: 'Büyük patates, 5 malzeme', price: 195, unit: 'adet', emoji: '🥔' },
        { id: 'bw-5', name: 'Profiterol', description: 'El yapımı, çikolata sos', price: 120, unit: 'porsiyon', emoji: '🍮' },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'bw-6', name: 'Milkshake', description: 'Çikolata / vanilya / çilek / oreo', price: 130, unit: 'bardak', emoji: '🥛', popular: true },
        { id: 'bw-7', name: 'Türk Kahvesi', price: 55, unit: 'fincan', emoji: '☕' },
        { id: 'bw-12', name: 'Limonata', description: 'Taze sıkılmış, nane', price: 70, unit: 'bardak', emoji: '🍋' },
        { id: 'bw-13', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const NADDET_DONER: Store = {
  id: 'naddet-doner',
  name: 'Naddet Döner & Burger',
  type: 'fast_food',
  emoji: '🌯',
  tagline: '3.8 puan · 10.000+ yorum · Döner ve burger',
  bannerColor: '#BF360C',
  rating: 3.8,
  etaMin: 22,
  minOrder: 0,
  address: 'Şadırvan Cd., Kemer Köprü Mah., Bartın',
  sections: [
    {
      category: 'Dönerler',
      items: [
        { id: 'nd-1', name: 'Et Döner Dürüm', description: 'Et döner, lavaş, salata', price: 190, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'nd-2', name: 'Tavuk Döner Dürüm', description: 'Tavuk döner, lavaş, taze yeşillik', price: 155, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'nd-8', name: 'Döner Ekmek (Et)', description: 'Somun ekmeğinde et döner', price: 155, unit: 'adet', emoji: '🥙' },
        { id: 'nd-9', name: 'Döner Ekmek (Tavuk)', description: 'Somun ekmeğinde tavuk döner', price: 125, unit: 'adet', emoji: '🥙' },
        { id: 'nd-3', name: 'İskender', description: 'Döner üstü, tereyağlı domates sos, yoğurt', price: 280, unit: 'porsiyon', emoji: '🍽️', popular: true },
      ],
    },
    {
      category: 'Burger',
      items: [
        { id: 'nd-4', name: 'Classic Burger', description: 'Dana köfte, kaşar, marul, sos', price: 195, unit: 'adet', emoji: '🍔', popular: true },
        { id: 'nd-5', name: 'Double Burger', description: '2 kat köfte, çift kaşar, turşu', price: 255, unit: 'adet', emoji: '🍔' },
        { id: 'nd-10', name: 'Tavuk Burger', description: 'Izgara tavuk, kaşar, koleslaw', price: 175, unit: 'adet', emoji: '🍔' },
      ],
    },
    {
      category: 'Ek & İçecek',
      items: [
        { id: 'nd-6', name: 'Patates Kızartması', price: 85, unit: 'porsiyon', emoji: '🍟' },
        { id: 'nd-7', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'nd-11', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
      ],
    },
  ],
};

const ONCU_DONER: Store = {
  id: 'oncu-doner',
  name: 'Öncü Döner',
  type: 'fast_food',
  emoji: '🌯',
  tagline: '3.7 puan · 5000+ yorum · Bartın\'ın öncü dönerci',
  bannerColor: '#8D6E63',
  rating: 3.7,
  etaMin: 20,
  minOrder: 0,
  address: 'Hükumet Cad., Kırtepe, Bartın Merkez',
  sections: [
    {
      category: 'Döner Çeşitleri',
      items: [
        { id: 'od-1', name: 'Tavuk Döner Dürüm (80g)', description: 'Tavuk döner, lavaş, domates, soğan', price: 130, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'od-7', name: 'Tavuk Zurna Dürüm (120g)', description: 'Büyük boy tavuk döner dürüm', price: 190, unit: 'adet', emoji: '🌯', popular: true },
        { id: 'od-8', name: 'Etli Döner Dürüm', description: 'Dana et döner, lavaş, domates, soğan', price: 195, unit: 'adet', emoji: '🌯' },
        { id: 'od-9', name: 'Tavuk Ekmek Arası', description: 'Somun ekmeği içinde tavuk döner', price: 105, unit: 'adet', emoji: '🥙' },
        { id: 'od-4', name: 'Et Döner Ekmek Arası', description: 'Somun ekmeği içinde et döner', price: 160, unit: 'adet', emoji: '🥙' },
        { id: 'od-3', name: 'İskender Porsiyonu', description: 'Döner üzerine tereyağlı domates, yoğurt', price: 270, unit: 'porsiyon', emoji: '🍽️', popular: true },
      ],
    },
    {
      category: 'İçecek',
      items: [
        { id: 'od-5', name: 'Ayran', price: 50, unit: 'bardak', emoji: '🥛' },
        { id: 'od-6', name: 'Kola 330ml', price: 80, unit: 'kutu', emoji: '🥤' },
        { id: 'od-10', name: 'Su 500ml', price: 30, unit: 'şişe', emoji: '💧' },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED LIST
// ─────────────────────────────────────────────────────────────────────────────

export const STORES: Store[] = [
  // Supermarkets
  BIM,
  A101,
  MIGROS_CUMHURIYET, MIGROS_KEMERKOPRU,
  SOK, BALMAR, MARKETIM, TARIM_KREDI,
  // Restaurants
  BALIK_EVI, KEBAPCI, PIDE_EVI, DONER_EVI, CORBA_EVI, BUGILLER,
  VILLAPARK, BARTIN_KENT, RECEBIN_YERI, MUSTAFA_AMCA,
  CIZZGARA, EMIR_PIDE, ALI_CHEF, KARADENIZ_BALIK,
  ANTEPLI_PIDE, TATS, URZ_OCAKBASI,
  // Fast Food
  KOMAGENE, BURGER_KING, DOMINOS, KOZMOS_PIZZA, POPEYES,
  SILA_KEBAP, PASAPORT_PIZZA, MS_DONER, ADIYAMAN_OCAKBASI,
  COBAN_KATIK_DONER, BEYSOS_DONER, UMUT_BURGER, SANDWICH_KRALLIGI,
  OZZIE_BURGER, BIBBER_PIZZA, ASG_DONER, NADDET_DONER, ONCU_DONER,
  // Cafes & Pastanes
  PASTANE, BALKAYA, SWEETARTS, ALACATI, MACKBEAR, GOLDBEANS, ARABICA,
  SURA_TATLI, YOREM_GOZLEME, BIRADER_WAFFLE,
  // Butcher
  KASAP,
  // Bakery
  HALK_EKMEK,
  // Pharmacy
  ECZANE,
];

export const STORE_CATEGORIES: { id: StoreType | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Tümü', emoji: '🏬' },
  { id: 'supermarket', label: 'Süpermarket', emoji: '🛒' },
  { id: 'restaurant', label: 'Restoran', emoji: '🍽️' },
  { id: 'fast_food', label: 'Fast Food', emoji: '🍔' },
  { id: 'cafe', label: 'Kafe & Pastane', emoji: '☕' },
  { id: 'butcher', label: 'Kasap', emoji: '🥩' },
  { id: 'bakery', label: 'Fırın', emoji: '🍞' },
  { id: 'pharmacy', label: 'Eczane', emoji: '💊' },
];
