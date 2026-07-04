import { useState, type FormEvent } from "react";
import { createOrderInput, type CreateOrderInput } from "@boh/contracts";
import { trpc } from "@boh/api";
import "./CreateOrder.css";

const SERVICE_TYPES: Array<{ value: CreateOrderInput["serviceType"]; label: string; icon: string }> = [
  { value: "delivery", label: "Kurir", icon: "📦" },
  { value: "shopping", label: "Belanja", icon: "🛒" },
  { value: "cleaning", label: "Kebersihan", icon: "🧹" },
  { value: "moving", label: "Angkut Barang", icon: "🚛" },
];

// Fixed Bartın-area coordinates for this scaffold — a real map picker (like
// the old single-app project's MapLeaflet) replaces these once that UI is
// built. Out of scope here: the point of this pass is order.create's
// validation + SQL->Firestore broadcast path, not location picking.
const PICKUP_COORDS = { lat: 41.6358, lng: 32.3375 };
const DESTINATION_COORDS = { lat: 41.55, lng: 32.45 };

interface CreateOrderProps {
  initialServiceType: CreateOrderInput["serviceType"];
  onCreated: (orderId: string) => void;
  onBack: () => void;
}

export function CreateOrder({ initialServiceType, onCreated, onBack }: CreateOrderProps) {
  const [serviceType, setServiceType] = useState<CreateOrderInput["serviceType"]>(initialServiceType);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createOrder = trpc.order.create.useMutation();
  // Live quote — purely informational. The server recomputes this exact
  // value itself from the same coordinates when order.create runs, so there's
  // nothing for the client to submit or tamper with here.
  const estimate = trpc.order.estimatePrice.useQuery({
    serviceType,
    pickupLat: PICKUP_COORDS.lat,
    pickupLng: PICKUP_COORDS.lng,
    destinationLat: DESTINATION_COORDS.lat,
    destinationLng: DESTINATION_COORDS.lng,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError(null);

    const candidate: Record<string, unknown> = {
      serviceType,
      pickupAddress,
      pickupLat: PICKUP_COORDS.lat,
      pickupLng: PICKUP_COORDS.lng,
      destinationAddress,
      destinationLat: DESTINATION_COORDS.lat,
      destinationLng: DESTINATION_COORDS.lng,
      notes: notes.trim() ? notes : undefined,
    };

    // Validate with the exact same Zod schema the server uses (imported
    // from @boh/contracts) — instant feedback here, and order.create on
    // the server independently re-validates regardless, since a client
    // check is never a substitute for server-side validation.
    const result = createOrderInput.safeParse(candidate);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errors[issue.path.join(".") || "form"] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      const orderId = await createOrder.mutateAsync(result.data);
      onCreated(orderId);
    } catch (err) {
      console.error("[CreateOrder] order.create failed", err);
      setSubmitError("Gagal membuat order — pastikan Anda sudah login (lihat bar DEV di atas).");
    }
  };

  const priceNumber = estimate.data ?? 0;

  return (
    <form className="create-order" onSubmit={handleSubmit}>
      <header className="create-order__header">
        <button type="button" className="create-order__back" onClick={onBack} aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1>Buat Pesanan</h1>
        <span className="create-order__header-spacer" />
      </header>

      <div className="create-order__card">
        <p className="create-order__card-label">Jenis Layanan</p>
        <div className="create-order__service-grid">
          {SERVICE_TYPES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`create-order__service-btn ${serviceType === s.value ? "is-active" : ""}`}
              onClick={() => setServiceType(s.value)}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="create-order__card">
        <p className="create-order__card-label">Lokasi</p>
        <div className="create-order__field">
          <label htmlFor="pickupAddress">Alamat Jemput</label>
          <input
            id="pickupAddress"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Bartın Merkez..."
          />
          {fieldErrors.pickupAddress && <span className="create-order__error">{fieldErrors.pickupAddress}</span>}
        </div>

        <div className="create-order__field">
          <label htmlFor="destinationAddress">Alamat Tujuan</label>
          <input
            id="destinationAddress"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Kozcağız..."
          />
          {fieldErrors.destinationAddress && (
            <span className="create-order__error">{fieldErrors.destinationAddress}</span>
          )}
        </div>
      </div>

      <div className="create-order__card">
        <p className="create-order__card-label">Estimasi Harga &amp; Catatan</p>
        <div className="create-order__estimate">
          <span className="create-order__estimate-label">Estimasi biaya</span>
          <span className="create-order__estimate-value">
            {estimate.isLoading ? "Menghitung..." : `₺${priceNumber.toLocaleString("tr-TR")}`}
          </span>
        </div>

        <div className="create-order__field">
          <label htmlFor="notes">Catatan (opsional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
      </div>

      {submitError && <p className="create-order__submit-error">{submitError}</p>}

      <div className="create-order__sticky-bar">
        <button type="submit" className="create-order__submit" disabled={createOrder.isPending}>
          {createOrder.isPending ? "Memproses..." : `Pesan Sekarang${priceNumber ? ` • ₺${priceNumber}` : ""}`}
        </button>
      </div>
    </form>
  );
}
