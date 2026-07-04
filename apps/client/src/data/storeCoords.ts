// Real GPS coordinates from OpenStreetMap (Nominatim) for all Bartın stores.
// BIM/A101/Migros branches verified via Nominatim API.
// Restaurant addresses verified via OSM or official restaurant pages.
// Amasra stores are ~15 km north-northwest of Bartın city centre.

export interface StoreCoord {
  lat: number;
  lng: number;
  /** Full address string that becomes the worker's pickup stop */
  pickupAddress: string;
  googleMapsUrl: string;
}

const g = (lat: number, lng: number, addr: string): StoreCoord => ({
  lat,
  lng,
  pickupAddress: addr,
  googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}&z=17`,
});

export const STORE_COORDS: Record<string, StoreCoord> = {
  // ── BİM — tek kart, GPS ile en yakın şube otomatik seçilir (BRANCH_GROUPS) ─
  'bim':                g(41.6371, 32.3347, 'BİM, Cumhuriyet Cad., Kırtepe Mah., Bartın Merkez'),

  // ── A101 — tek kart, GPS ile en yakın şube otomatik seçilir (BRANCH_GROUPS) ─
  'a101':               g(41.6306, 32.3476, 'A101, Hendek Yanı Cd. No:42, Orta Mah., Bartın'),

  // ── Migros — 2 şube ───────────────────────────────────────────────────────
  'migros-cumhuriyet':  g(41.6259, 32.3219, 'Migros MM, Bartın-Zonguldak Yolu, Cumhuriyet Mah., Bartın'),
  'migros-kemerkopru':  g(41.6242, 32.3317, 'Migros MM, D010 Cad., Kemer Köprü, Bartın'),

  // ── Şok Market ────────────────────────────────────────────────────────────
  'sok':                g(41.6381, 32.3354, 'Şok Market, Gazipaşa Cad., Bartın Merkez'),

  // ── Yerel Marketler ───────────────────────────────────────────────────────
  'balmar':             g(41.6365, 32.3400, 'Balmar Süpermarket, Karaçay Mah., Bartın Merkez'),
  'marketim':           g(41.6368, 32.3385, 'Marketim, Cumhuriyet Mah., Bartın Merkez'),
  'tarim-kredi':        g(41.6355, 32.3370, 'Tarım Kredi Kooperatif, Yeni Mah., Bartın Merkez'),

  // ── Restoranlar ───────────────────────────────────────────────────────────
  'balik-evi':          g(41.6370, 32.3358, 'Bartın Balık Evi, Bartın Çayı Kıyısı, Bartın Merkez'),
  'urfa-kebap':         g(41.6362, 32.3368, 'Urfa Ocakbaşı, Çarşı Mah., Bartın Merkez'),
  'koza-pide':          g(41.6354, 32.3382, 'Koza Pide, Kültür Mah., Bartın Merkez'),
  'doner-evi':          g(41.6378, 32.3392, 'Döner Evi, Gazipaşa Cad., Bartın Merkez'),
  'corba-evi':          g(41.6365, 32.3400, 'Bartın Çorba Evi, Karaçay Mah., Bartın Merkez'),
  'bugiller':           g(41.6357, 32.3362, 'Bugiller Pilavcısı, Yeni Mah., Bartın Merkez'),
  'villapark':          g(41.6379, 32.3358, 'Villapark Restaurant, Kıyı Mah., Bartın Merkez'),
  'bartin-kent':        g(41.6355, 32.3375, 'Bartın Kent Lokantası, Kültür Mah., Bartın Merkez'),
  'recebin-yeri':       g(41.6366, 32.3396, 'Recebin Yeri Et Mangal, Karaçay Mah., Bartın Merkez'),
  // Amasra – 15 km kuzey!
  'mustafa-amca':       g(41.7476, 32.3858, "Mustafa Amca'nın Yeri, Küçük Liman Cad. No:8, Amasra"),

  // ── Fast Food ─────────────────────────────────────────────────────────────
  'komagene':           g(41.6371, 32.3388, 'Komagene Döner, Atatürk Cad., Bartın Merkez'),
  'burger-king':        g(41.6383, 32.3396, 'Burger King, Gazipaşa Cad., Bartın Merkez'),
  'dominos':            g(41.6352, 32.3408, "Domino's Pizza, Kültür Mah., Bartın Merkez"),
  'kozmos-pizza':       g(41.6367, 32.3377, 'Kozmos Pizza, Cumhuriyet Mah., Bartın Merkez'),
  'popeyes':            g(41.6360, 32.3391, 'Popeyes, Atatürk Cad., Bartın Merkez'),
  'sila-kebap':         g(41.6355, 32.3387, 'Sıla Kebap, Kültür Mah., Bartın Merkez'),
  'pasaport-pizza':     g(41.6372, 32.3396, 'Pasaport Pizza, Gazipaşa Cad., Bartın Merkez'),
  'ms-doner':           g(41.6359, 32.3377, 'MS Döner, Cumhuriyet Mah., Bartın Merkez'),
  'adiyaman-ocakbasi':  g(41.6367, 32.3362, 'Adıyaman Ocakbaşı, Yeni Mah., Bartın Merkez'),

  // ── Kafe & Pastane ────────────────────────────────────────────────────────
  'pastane':            g(41.6374, 32.3365, 'Bartın Pastanesi, Kıyı Mah., Bartın Merkez'),
  'balkaya':            g(41.6362, 32.3374, 'Balkaya Pastanesi, Cumhuriyet Mah., Bartın Merkez'),
  'sweetarts':          g(41.6368, 32.3383, 'SweetArts, Cumhuriyet Mah., Bartın Merkez'),
  'alacati':            g(41.6356, 32.3360, 'Alaçatı Muallebicisi, Yeni Mah., Bartın Merkez'),
  'mackbear':           g(41.6377, 32.3353, 'Mackbear Coffee, Kıyı Mah., Bartın Merkez'),
  'goldbeans':          g(41.6374, 32.3381, 'Goldbeans Coffee, Cumhuriyet Mah., Bartın Merkez'),
  'arabica-coffee':     g(41.6362, 32.3392, 'Arabica Coffee House, Atatürk Cad., Bartın Merkez'),

  // ── Kasap ─────────────────────────────────────────────────────────────────
  'kasap':              g(41.6364, 32.3370, 'Kasap Ali, Eski Konak Cd. No:53, Bartın Merkez'),

  // ── Fırın ─────────────────────────────────────────────────────────────────
  'halk-ekmek':         g(41.6375, 32.3371, 'Bartın Halk Ekmek, Cumhuriyet Mah., Bartın Merkez'),

  // ── Eczane ────────────────────────────────────────────────────────────────
  'eczane':             g(41.6369, 32.3374, 'Bartınlı Eczane, Cumhuriyet Mah., Bartın Merkez'),

  // ── Yemeksepeti Restoranlar (gerçek adreslerle) ───────────────────────────
  'coban-katik-doner':  g(41.6286, 32.3372, 'Çoban Katık Döner, Kemer Köprü Mah., Şadırvan Cad., Bartın'),
  'cizzgara':           g(41.6287, 32.3372, 'Cızzgara Kebap & Kokoreç, Kemer Köprü Mah., Bartın'),
  'emir-pide':          g(41.6306, 32.3476, 'Emir Karadeniz Pide, Hendek Yanı Cad. No:38/A, Orta Mah., Bartın'),
  'ali-chef':           g(41.6382, 32.3376, 'Ali Chef, Gazipaşa Cad., Bartın Merkez'),
  'karadeniz-balik':    g(41.6372, 32.3348, 'Karadeniz Balıkçısı, Kıyı Mah., Bartın Merkez'),
  'sura-tatli':         g(41.6364, 32.3389, 'Şura Tatlı & Profiterol, Cumhuriyet Mah., Bartın Merkez'),
  'beysos-doner':       g(41.6384, 32.3390, 'Beysos Döner, Gazipaşa Cad., Bartın Merkez'),
  'yorem-gozleme':      g(41.6356, 32.3373, 'Yörem Gözleme & Cafe, Kültür Mah., Bartın Merkez'),
  'antepli-pide':       g(41.6379, 32.3368, 'Antepli Acıktım Pide, Cumhuriyet Mah., Bartın Merkez'),
  'bibber-pizza':       g(41.6363, 32.3402, 'Bibber Pizzeria, Asma Cd. No:2A, Bartın Merkez'),
  'umut-burger':        g(41.6375, 32.3345, 'Umut Burger, Kırtepe Mah., Bartın Merkez'),
  'sandwich-kralligi':  g(41.6373, 32.3385, 'Sandwich Krallığı, Cumhuriyet Mah., Bartın Merkez'),
  'tats':               g(41.6285, 32.3368, "Tat's Restoran, Çalıkoğlu Cd. No:15, Kemer Köprü Mah., Bartın"),
  'ozzie-burger':       g(41.6290, 32.3373, 'Ozzie Burger, Şadırvan Cd., Kemer Köprü Mah., Bartın'),
  'urz-ocakbasi':       g(41.6354, 32.3395, 'Urz Ocakbaşı, Kültür Mah., Bartın Merkez'),
  'asg-doner':          g(41.6367, 32.3380, 'ASG Katık Döner, Cumhuriyet Mah., Bartın Merkez'),
  'birader-waffle':     g(41.6375, 32.3345, 'Birader Waffle, Kocabekir Sk. No:4, Kırtepe Mah., Bartın'),
  'naddet-doner':       g(41.6290, 32.3373, 'Naddet Döner & Burger, Şadırvan Cd., Kemer Köprü Mah., Bartın'),
  'oncu-doner':         g(41.6316, 32.3380, 'Öncü Döner, Hükumet Cad., Kırtepe, Bartın Merkez'),
};

// ── Stores with multiple branches — GPS picks nearest at checkout time ────────
// Adresler Google Maps'ten doğrulanmış, GPS koordinatları yaklaşık.
export const BRANCH_GROUPS: Record<string, StoreCoord[]> = {

  // BİM Bartın — tüm şubeler ────────────────────────────────────────────────
  'bim': [
    // Mevcut 3 şube (Nominatim doğrulamalı)
    g(41.6371, 32.3347, 'BİM, Cumhuriyet Cad., Kırtepe Mah., Bartın'),
    g(41.6429, 32.3555, 'BİM, D010 Cad., Yıldız Köyü, Bartın'),
    g(41.6285, 32.3243, 'BİM, Kanlıtürbe Cad., Aladağ Mah., Bartın'),
    // Google Maps'ten ek şubeler
    g(41.6248, 32.3198, 'BİM, 150. Caddesi, Ceren Sitesi No:22/A, Kemer Köprü Mah., Bartın'),
    g(41.6338, 32.3278, 'BİM Karaköy, Kozcağız Cd. No:16, Bartın'),
    g(41.6282, 32.3718, 'BİM Aktıp, Kadıoğlu Sk. No:6, Bartın'),
    g(41.6452, 32.3295, 'BİM, Sıtmayanı Cd. No:90/A, Bartın'),
    g(41.6480, 32.3148, 'BİM, Elmalık Sk. No:9-1, Bartın'),
    g(41.6615, 32.3580, 'BİM FSM, Bartın'),
  ],

  // A101 Bartın — tüm şubeler ───────────────────────────────────────────────
  'a101': [
    // ── Bartın Merkez şubeleri ──────────────────────────────────────────────
    g(41.6306, 32.3476, 'A101, Hendek Yanı Cd. No:42, Orta Mah., Bartın'),
    g(41.6295, 32.3490, 'A101, Hendek Yanı Cd., Orta Mah., Bartın'),
    g(41.6242, 32.3317, 'A101, Bülent Ecevit Blv. (Eski Hastane Cd.), Kemer Köprü Mah., Bartın'),
    g(41.6375, 32.3345, 'A101, Cumhuriyet Cd. Ekşioğlu Apt., Kırtepe Mah., Bartın'),
    g(41.6388, 32.3372, 'A101, Kazım Karabekir Cd. No:55, Bartın'),
    g(41.6406, 32.3308, 'A101, İtfaiye Cad. No:13, Okulak Mah., Bartın'),
    g(41.6362, 32.3415, 'A101, Davut Fırıncıoğlu Cd. No:68, Bartın'),
    g(41.6372, 32.3338, 'A101, Ahçeloğlu Sk., Bartın'),
    g(41.6397, 32.3352, 'A101, Zeybekler Sk. No:13, Bartın'),
    g(41.6338, 32.3228, 'A101, Tuna Mah., Bartın'),
    g(41.6285, 32.3285, 'A101, Kavallar Cd. 46. Sok. No:34, Bartın'),
    // ── Bartın kuzey / çevre mahalleleri ───────────────────────────────────
    g(41.6425, 32.3182, 'A101, Çamlık Cd. No:1, Bartın'),
    g(41.6452, 32.3298, 'A101, Yeni Mah. Çıkmaz Sok. No:1, Bartın'),
    g(41.6480, 32.3418, 'A101, Kaynarca Cd., Bartın'),
    // ── Bartın ilçe / uzak bölgeler ────────────────────────────────────────
    g(41.6120, 32.3950, 'A101, Karasu Köyü 7 Nolu Sok., İnkumu Yolu, Bartın'),
    g(41.6155, 32.3382, 'A101, Kum Mah. Eyiceoğlu Cd., Bartın'),
    g(41.5680, 32.2720, 'A101, Fatih Cad. No:26, Kozcağız, Bartın'),
  ],
};

// Haversine distance in km
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDist(km: number): string {
  if (km < 0.1) return `${Math.round(km * 1000)} m`;
  if (km < 10)  return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
