import { useState } from "react";
import { trpc } from "@boh/api";
import { Search, RefreshCw, ChevronLeft, ChevronRight, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@boh/db";

type UserRole = User["role"];

const roleStyle: Record<UserRole, { bg: string; text: string; label: string }> = {
  customer: { bg: "#ede9fe", text: "#7c3aed", label: "Pelanggan" },
  worker:   { bg: "#d1fae5", text: "#059669", label: "Pekerja"   },
  admin:    { bg: "#b7eff3", text: "#00373a", label: "Admin"     },
};

const roles: (UserRole | "")[] = ["", "customer", "worker", "admin"];
const roleFilterLabel: Record<string, string> = {
  "":       "Semua",
  customer: "Pelanggan",
  worker:   "Pekerja",
  admin:    "Admin",
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name[0].toUpperCase();
}

const avatarColors = [
  "#38d1da", "#7c3aed", "#059669", "#d97706", "#2563eb", "#dc2626",
];

function avatarColor(id: number): string {
  return avatarColors[id % avatarColors.length];
}

export function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("customer");

  const { data, isLoading, refetch } = trpc.admin.listUsers.useQuery({
    limit: 20,
    cursor,
    role: roleFilter,
  });

  const setRoleMutation = trpc.admin.setUserRole.useMutation({
    onSuccess: () => { setEditUser(null); void refetch(); },
  });

  const users = (data?.items ?? []).filter(
    (u) => search === "" || u.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const onlineCount = (data?.items ?? []).filter((u) => u.isOnline).length;

  return (
    <div className="px-4 md:px-8 py-5 md:py-7 max-w-5xl mx-auto">

      {/* Stats bento */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Total Pengguna", value: data?.items.length ?? 0, accent: "var(--primary)" },
          { label: "Online Sekarang", value: onlineCount, accent: "#059669" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid var(--outline-variant)",
              borderTop: `3px solid ${s.accent}`,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--on-surface-variant)" }}>
              {s.label}
            </p>
            <p className="text-2xl font-extrabold" style={{ color: "var(--on-surface)" }}>
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Search + refresh */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "var(--on-surface-variant)" }} />
          <input
            placeholder="Cari nama pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm font-medium outline-none bg-transparent"
            style={{ color: "var(--on-surface)" }}
          />
        </div>
        <button
          onClick={() => void refetch()}
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-95"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <RefreshCw className="w-4 h-4" style={{ color: "var(--on-surface-variant)" }} />
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {roles.map((r) => {
          const active = (r || undefined) === roleFilter;
          return (
            <button
              key={r || "all"}
              onClick={() => { setRoleFilter(r || undefined); setCursor(undefined); }}
              className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              style={
                active
                  ? { background: "var(--primary)", color: "var(--on-primary)" }
                  : {
                      background: "var(--surface-container-lowest)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface-variant)",
                    }
              }
            >
              {roleFilterLabel[r]}
            </button>
          );
        })}
      </div>

      {/* User cards */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div
            className="w-8 h-8 rounded-full border-[3px]"
            style={{
              borderColor: "var(--outline-variant)",
              borderTopColor: "var(--primary)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center text-sm" style={{ color: "var(--on-surface-variant)" }}>
          Tidak ada pengguna
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, i) => {
            const rs = roleStyle[user.role];
            const color = avatarColor(user.id);
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: "var(--surface-container-lowest)",
                  border: "1px solid var(--outline-variant)",
                }}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: color }}
                  >
                    {getInitials(user.name)}
                  </div>
                  {user.isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                      style={{
                        background: "#10b981",
                        borderColor: "var(--surface-container-lowest)",
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {user.name ?? `User #${user.id}`}
                    </p>
                    <span
                      className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: rs.bg, color: rs.text }}
                    >
                      {rs.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--on-surface-variant)" }}>
                    {user.phone ?? "—"}
                    {user.rating != null && (
                      <span className="ml-2">⭐ {Number(user.rating).toFixed(1)}</span>
                    )}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => { setEditUser(user); setNewRole(user.role); }}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
                  style={{ background: "#ede9fe", color: "#7c3aed" }}
                >
                  <UserCog className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(cursor || data?.nextCursor) && (
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => setCursor(undefined)}
            disabled={!cursor}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold disabled:opacity-40 transition-all active:scale-95"
            style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
          >
            <ChevronLeft className="w-4 h-4" /> Pertama
          </button>
          <button
            onClick={() => setCursor(data?.nextCursor)}
            disabled={!data?.nextCursor}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold disabled:opacity-40 transition-all active:scale-95"
            style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-6 sm:items-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setEditUser(null)}
          >
            <motion.div
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: "var(--surface-container-lowest)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: avatarColor(editUser.id) }}
                >
                  {getInitials(editUser.name)}
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: "var(--on-surface)" }}>
                    Ubah Role
                  </h3>
                  <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    {editUser.name ?? `User #${editUser.id}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-5">
                {(["customer", "worker", "admin"] as UserRole[]).map((r) => {
                  const rs = roleStyle[r];
                  return (
                    <button
                      key={r}
                      onClick={() => setNewRole(r)}
                      className="flex-1 py-3 rounded-2xl text-xs font-bold transition-all"
                      style={
                        newRole === r
                          ? { background: rs.bg, color: rs.text, border: `2px solid ${rs.text}` }
                          : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }
                      }
                    >
                      {rs.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
                >
                  Batal
                </button>
                <button
                  onClick={() => setRoleMutation.mutate({ userId: editUser.id, role: newRole })}
                  disabled={newRole === editUser.role || setRoleMutation.isPending}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-50 gradient-cyan"
                >
                  {setRoleMutation.isPending ? "…" : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
