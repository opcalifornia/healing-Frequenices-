import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, apiEnabled, setAuthToken } from "../api/client";
import type { ContinueEntry, CustomSession, Profile } from "../types";

interface Library {
  favorites: string[];
  continue: ContinueEntry[];
  custom: CustomSession[];
}

interface Account {
  id: string;
  email: string;
}

interface UserState {
  token: string | null;
  account: Account | null;
  profiles: Profile[];
  activeProfileId: string | null;
  libraries: Record<string, Library>;
  safetyAcknowledged: boolean;

  selectProfile(id: string | null): void;
  addProfile(name: string, hue: number, kids?: boolean): Promise<void>;
  updateProfile(id: string, patch: Partial<Pick<Profile, "name" | "hue">>): Promise<void>;
  removeProfile(id: string): Promise<void>;

  toggleFavorite(titleId: string): void;
  recordProgress(titleId: string, position: number, duration: number): void;
  removeContinue(titleId: string): void;
  saveCustom(session: Omit<CustomSession, "id" | "createdAt">): CustomSession;
  deleteCustom(id: string): void;

  acknowledgeSafety(): void;
  signIn(email: string, password: string, mode: "login" | "register"): Promise<void>;
  signOut(): void;
  refreshFromServer(): Promise<void>;
}

const emptyLibrary = (): Library => ({ favorites: [], continue: [], custom: [] });
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const DEFAULT_PROFILES: Profile[] = [
  { id: "p-main", name: "Listener", hue: 262 },
  { id: "p-guest", name: "Guest", hue: 168 },
];

/** Fire-and-forget sync to the API when signed in. Local state is the source of
 *  truth for the UI; server errors are logged, not surfaced, so playback never blocks. */
function remote(fn: () => Promise<unknown>) {
  if (!apiEnabled || !useUser.getState().token) return;
  fn().catch((err) => console.warn("[sync]", err));
}

export const useUser = create<UserState>()(
  persist(
    (set, get) => {
      const lib = (): Library => {
        const id = get().activeProfileId;
        return (id && get().libraries[id]) || emptyLibrary();
      };
      const setLib = (next: Library) => {
        const id = get().activeProfileId;
        if (!id) return;
        set({ libraries: { ...get().libraries, [id]: next } });
      };

      return {
        token: null,
        account: null,
        profiles: DEFAULT_PROFILES,
        activeProfileId: null,
        libraries: {},
        safetyAcknowledged: false,

        selectProfile(id) {
          set({ activeProfileId: id });
        },

        async addProfile(name, hue, kids) {
          let profile: Profile = { id: `p-${uid()}`, name, hue, kids };
          if (apiEnabled && get().token) {
            profile = await api<Profile>("/profiles", { method: "POST", body: { name, hue, kids: !!kids } });
          }
          set({ profiles: [...get().profiles, profile] });
        },

        async updateProfile(id, patch) {
          set({ profiles: get().profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
          remote(() => api(`/profiles/${id}`, { method: "PATCH", body: patch }));
        },

        async removeProfile(id) {
          const libraries = { ...get().libraries };
          delete libraries[id];
          set({
            profiles: get().profiles.filter((p) => p.id !== id),
            libraries,
            activeProfileId: get().activeProfileId === id ? null : get().activeProfileId,
          });
          remote(() => api(`/profiles/${id}`, { method: "DELETE" }));
        },

        toggleFavorite(titleId) {
          const l = lib();
          const has = l.favorites.includes(titleId);
          setLib({ ...l, favorites: has ? l.favorites.filter((f) => f !== titleId) : [titleId, ...l.favorites] });
          const pid = get().activeProfileId;
          remote(() => api(`/profiles/${pid}/favorites/${titleId}`, { method: has ? "DELETE" : "PUT" }));
        },

        recordProgress(titleId, position, duration) {
          const l = lib();
          const entry: ContinueEntry = { titleId, position, duration, updatedAt: new Date().toISOString() };
          // Finished sessions drop out of Continue Listening.
          const done = duration > 0 && position >= duration - 5;
          const rest = l.continue.filter((c) => c.titleId !== titleId);
          setLib({ ...l, continue: done ? rest : [entry, ...rest].slice(0, 30) });
          const pid = get().activeProfileId;
          remote(() =>
            done
              ? api(`/profiles/${pid}/continue/${titleId}`, { method: "DELETE" })
              : api(`/profiles/${pid}/continue/${titleId}`, { method: "PUT", body: { position, duration } }),
          );
        },

        removeContinue(titleId) {
          const l = lib();
          setLib({ ...l, continue: l.continue.filter((c) => c.titleId !== titleId) });
          const pid = get().activeProfileId;
          remote(() => api(`/profiles/${pid}/continue/${titleId}`, { method: "DELETE" }));
        },

        saveCustom(input) {
          const session: CustomSession = { ...input, id: `c-${uid()}`, createdAt: new Date().toISOString() };
          const l = lib();
          setLib({ ...l, custom: [session, ...l.custom] });
          const pid = get().activeProfileId;
          remote(() => api(`/profiles/${pid}/custom-sessions`, { method: "POST", body: session }));
          return session;
        },

        deleteCustom(id) {
          const l = lib();
          setLib({ ...l, custom: l.custom.filter((c) => c.id !== id) });
          const pid = get().activeProfileId;
          remote(() => api(`/profiles/${pid}/custom-sessions/${id}`, { method: "DELETE" }));
        },

        acknowledgeSafety() {
          set({ safetyAcknowledged: true });
        },

        async signIn(email, password, mode) {
          const res = await api<{ token: string; user: Account }>(`/auth/${mode}`, {
            method: "POST",
            body: { email, password },
          });
          setAuthToken(res.token);
          set({ token: res.token, account: res.user, activeProfileId: null });
          await get().refreshFromServer();
        },

        signOut() {
          setAuthToken(null);
          set({ token: null, account: null, profiles: DEFAULT_PROFILES, libraries: {}, activeProfileId: null });
        },

        async refreshFromServer() {
          if (!apiEnabled || !get().token) return;
          setAuthToken(get().token);
          try {
            const me = await api<{ user: Account; profiles: Profile[] }>("/me");
            const libraries: Record<string, Library> = {};
            await Promise.all(
              me.profiles.map(async (p) => {
                libraries[p.id] = await api<Library>(`/profiles/${p.id}/library`);
              }),
            );
            const active = get().activeProfileId;
            set({
              account: me.user,
              profiles: me.profiles,
              libraries,
              activeProfileId: me.profiles.some((p) => p.id === active) ? active : null,
            });
          } catch (err) {
            console.warn("[auth] session expired", err);
            get().signOut();
          }
        },
      };
    },
    {
      name: "hf-user",
      version: 1,
      partialize: (s) => ({
        token: s.token,
        account: s.account,
        profiles: s.profiles,
        activeProfileId: s.activeProfileId,
        libraries: s.libraries,
        safetyAcknowledged: s.safetyAcknowledged,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token);
      },
    },
  ),
);

export function useActiveProfile(): Profile | null {
  return useUser((s) => s.profiles.find((p) => p.id === s.activeProfileId) ?? null);
}

const EMPTY = emptyLibrary();
export function useLibrary(): Library {
  return useUser((s) => (s.activeProfileId && s.libraries[s.activeProfileId]) || EMPTY);
}
