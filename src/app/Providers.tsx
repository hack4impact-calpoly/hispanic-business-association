"use client";

import { SWRConfig, Cache } from "swr";
import { ReactNode } from "react";

/**
 * Creates a localStorage-based cache provider for SWR
 * Persists cache between page refreshes
 */
function localStorageProvider(cache: Readonly<Cache<any>>): Cache<any> {
  // Initialize map for cache storage
  let map: Map<any, any> = new Map();

  // Only access localStorage in browser environment
  if (typeof window !== "undefined" && window.localStorage) {
    // Attempt to restore cache from localStorage
    const storedCache = localStorage.getItem("hba-cache");
    if (storedCache) {
      map = new Map(JSON.parse(storedCache));
    }

    // Save cache to localStorage before page unload
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem("hba-cache", appCache);
    });
  }

  return map;
}

/**
 * Global fetcher function for SWR
 * Disables HTTP cache to ensure fresh data
 */
const fetcher = (resource: string | URL | Request) =>
  fetch(resource, { cache: "no-store" }).then((res) => {
    // Throw error for non-200 responses
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  });

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global providers wrapper component
 * Configures SWR with persistent caching and error handling
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher: fetcher,
        keepPreviousData: true,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 2,
        // This helps with hydration for SSR
        fallback: {},
        suspense: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
