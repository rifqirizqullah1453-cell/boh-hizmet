import { getAuth, signOut } from "firebase/auth";
import { trpc } from "@boh/api";
import { useAuth } from "../features/auth/useAuth";
import "./ProfilePage.css";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ProfilePage() {
  const { user } = useAuth();

  const { data: workerMe } = trpc.worker.me.useQuery(undefined, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recent completed orders to calculate today's earnings
  const { data: completedData } = trpc.order.listMine.useQuery(
    { status: "COMPLETED", limit: 50 },
    { staleTime: 1000 * 60 }
  );

  const today = new Date();
  const todayOrders = (completedData?.items ?? []).filter(
    (o) => isSameDay(new Date(o.createdAt), today)
  );
  const todayEarnings = todayOrders.reduce((sum, o) => sum + o.price, 0);
  const totalCompletedCount = completedData?.items.length ?? 0;

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Pekerja";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const rating = workerMe?.rating != null ? Number(workerMe.rating) : null;
  const totalRatings = workerMe?.totalRatings ?? 0;
  const isOnline = workerMe?.isOnline ?? false;

  const handleLogout = () => signOut(getAuth());

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <h1 className="profile-page__title">Profil</h1>
      </header>

      {/* Identity card */}
      <div className="profile-page__card">
        <div className="profile-page__avatar">{avatarInitial}</div>
        <h2 className="profile-page__name">{displayName}</h2>
        {user?.email && <p className="profile-page__email">{user.email}</p>}
        <div className={`profile-page__status-pill ${isOnline ? "is-online" : ""}`}>
          <span className="profile-page__status-dot" />
          {isOnline ? "Sedang Online" : "Offline"}
        </div>
        {rating != null && (
          <div className="profile-page__rating">
            <span>⭐</span>
            <strong>{rating.toFixed(1)}</strong>
            <span className="profile-page__rating-count">· {totalRatings} ulasan</span>
          </div>
        )}
      </div>

      {/* Daily stats */}
      <div className="profile-page__stats">
        <div className="profile-page__stat">
          <p className="profile-page__stat-value">₺{todayEarnings.toLocaleString("tr-TR")}</p>
          <p className="profile-page__stat-label">Pendapatan Hari Ini</p>
        </div>
        <div className="profile-page__stat-sep" />
        <div className="profile-page__stat">
          <p className="profile-page__stat-value">{todayOrders.length}</p>
          <p className="profile-page__stat-label">Order Selesai Hari Ini</p>
        </div>
        <div className="profile-page__stat-sep" />
        <div className="profile-page__stat">
          <p className="profile-page__stat-value">{totalCompletedCount}</p>
          <p className="profile-page__stat-label">Total Order</p>
        </div>
      </div>

      {/* Logout */}
      <div className="profile-page__footer">
        <button type="button" className="profile-page__logout" onClick={handleLogout}>
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
