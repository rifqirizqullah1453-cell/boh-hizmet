import { useState } from "react";
import { trpc } from "@boh/api";
import { Search, RefreshCw, ChevronRight, ChevronLeft, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@boh/db";

type UserRole = User["role"];

const roleColors: Record<UserRole, { bg: string; text: string }> = {
  customer: { bg: "#EDE9FE", text: "#7C3AED" },
  worker:   { bg: "#D1FAE5", text: "#059669" },
  admin:    { bg: "#FEF3C7", text: "#D97706" },
};

const roles: (UserRole | "")[] = ["", "customer", "worker", "admin"];

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

  const users = (data?.items ?? []).filter((u) =>
    search === "" || u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Semua pengguna terdaftar</p>
        </div>
        <button onClick={() => void refetch()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
          <input
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", width: 220 }}
          />
        </div>
        <div className="flex gap-2">
          {roles.map((r) => (
            <button key={r || "all"} onClick={() => { setRoleFilter(r || undefined); setCursor(undefined); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
              style={(r || undefined) === roleFilter ? { background: "var(--cyan)", color: "white" } : { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {r || "Semua"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {["ID", "Nama", "Telepon", "Role", "Rating", "Status", "Bergabung", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>Memuat...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>Tidak ada user</td></tr>
              ) : (
                users.map((user) => {
                  const rc = roleColors[user.role];
                  return (
                    <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{user.id}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--text)" }}>{user.name ?? "—"}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>{user.phone ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold capitalize" style={{ background: rc.bg, color: rc.text }}>{user.role}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                        {user.rating != null ? `⭐ ${Number(user.rating).toFixed(1)} (${user.totalRatings})` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isOnline ? (
                          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#10B981" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Online
                          </span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Offline</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditUser(user); setNewRole(user.role); }} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: "#EDE9FE", color: "#7C3AED" }}>
                          <UserCog className="w-3.5 h-3.5" /> Role
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setCursor(undefined)} disabled={!cursor} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <ChevronLeft className="w-3.5 h-3.5" /> Pertama
          </button>
          <button onClick={() => setCursor(data?.nextCursor)} disabled={!data?.nextCursor} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setEditUser(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--bg-card)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EDE9FE" }}><UserCog className="w-5 h-5" style={{ color: "#7C3AED" }} /></div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Ubah Role</h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{editUser.name ?? `User #${editUser.id}`}</p>
                </div>
              </div>
              <div className="flex gap-2 mb-5">
                {(["customer", "worker", "admin"] as UserRole[]).map((r) => (
                  <button key={r} onClick={() => setNewRole(r)} className="flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all"
                    style={newRole === r ? { background: "var(--cyan)", color: "white" } : { background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Batal</button>
                <button onClick={() => setRoleMutation.mutate({ userId: editUser.id, role: newRole })} disabled={newRole === editUser.role || setRoleMutation.isPending} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 gradient-cyan">
                  {setRoleMutation.isPending ? "..." : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
