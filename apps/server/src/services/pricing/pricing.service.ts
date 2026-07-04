import type { serviceTypeSchema } from "@boh/contracts";
import type { z } from "zod";

type ServiceType = z.infer<typeof serviceTypeSchema>;

const EARTH_RADIUS_KM = 6371;

/**
 * Great-circle distance between two lat/lng points. This is the building
 * block for order pricing — see estimatePrice below — and is also where
 * a future "nearby workers" radius query would start from.
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Distance-based rate: 70 TL per 500 m = 0.14 TL/m = 140 TL/km.
// Calculated continuously per meter against the GPS straight-line distance,
// so the price the user sees always matches the km shown on screen.
const RATE_PER_METER = 70 / 500; // 0.14 TL/m

const STOP_FEE = 10; // TL per extra stop

/**
 * The only place an order's price is ever computed. order.create calls this
 * itself rather than trusting a client-submitted number — letting the
 * client dictate price would mean a tampered request could place a ₺1 order.
 * Rounded to the nearest whole lira.
 */
const MINIMUM_FARE = 70; // TL — covers the first 500 m flat

export function estimatePrice(_serviceType: ServiceType, distanceKm: number, stopCount = 0): number {
  const distanceFare = Math.max(MINIMUM_FARE, Math.round(distanceKm * 1000 * RATE_PER_METER));
  return distanceFare + stopCount * STOP_FEE;
}
