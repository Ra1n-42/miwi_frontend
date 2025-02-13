import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

// QueryClient mit angepasster Konfiguration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 Stunden
      staleTime: 1000 * 60 * 60, // 1 Stunde
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Storage Persister für den Cache
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Persistenz-Konfiguration
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 Stunden
  buster: "v1", // Ändern Sie dies, wenn Sie den Cache invalidieren möchten
});
