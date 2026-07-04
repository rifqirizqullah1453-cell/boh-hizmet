import { useState } from "react";
import { trpc, TRPCClientError } from "@boh/api";
import "./RatingCard.css";

interface RatingCardProps {
  orderId: string;
}

export function RatingCard({ orderId }: RatingCardProps) {
  const utils = trpc.useUtils();
  const existing = trpc.rating.forOrder.useQuery({ orderId });
  const submitRating = trpc.rating.submit.useMutation();

  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (stars === 0) {
      setError("Pilih bintang dulu sebelum mengirim.");
      return;
    }
    setError(null);
    try {
      await submitRating.mutateAsync({ orderId, stars, comment: comment.trim() || undefined });
      utils.rating.forOrder.invalidate({ orderId });
    } catch (err) {
      // CONFLICT means another request for this same order already landed
      // a rating first (unique index in rating.repository.ts) — refresh to
      // show the existing one instead of a generic failure.
      if (err instanceof TRPCClientError && err.data?.code === "CONFLICT") {
        utils.rating.forOrder.invalidate({ orderId });
      } else {
        setError("Gagal mengirim rating. Coba lagi.");
      }
    }
  };

  if (existing.isLoading) {
    return null;
  }

  if (existing.data) {
    return (
      <div className="rating-card">
        <h3>Rating Anda</h3>
        <div className="rating-card__stars rating-card__stars--readonly">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= existing.data!.stars ? "is-filled" : ""}>
              ★
            </span>
          ))}
        </div>
        {existing.data.comment && <p className="rating-card__comment">{existing.data.comment}</p>}
      </div>
    );
  }

  return (
    <div className="rating-card">
      <h3>Beri Rating Pekerja</h3>
      <div className="rating-card__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= (hoverStars || stars) ? "is-filled" : ""}
            onMouseEnter={() => setHoverStars(n)}
            onMouseLeave={() => setHoverStars(0)}
            onClick={() => setStars(n)}
            aria-label={`${n} bintang`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="rating-card__comment-input"
        placeholder="Komentar (opsional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={2}
      />
      {error && <p className="rating-card__error">{error}</p>}
      <button
        type="button"
        className="rating-card__submit"
        onClick={handleSubmit}
        disabled={submitRating.isPending}
      >
        {submitRating.isPending ? "Mengirim..." : "Kirim Rating"}
      </button>
    </div>
  );
}
