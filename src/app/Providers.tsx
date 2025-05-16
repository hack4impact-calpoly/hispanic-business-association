"use client";

import { SWRConfig, Cache } from "swr";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";

function localStorageProvider(cache: Readonly<Cache<any>>): Cache<any> {
  let map: Map<any, any> = new Map();
  if (typeof window !== "undefined" && window.localStorage) {
    const storedCache = localStorage.getItem("hba-cache");
    if (storedCache) {
      map = new Map(JSON.parse(storedCache));
    }
    window.addEventListener("beforeunload", () => {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem("hba-cache", appCache);
    });
  }
  return map;
}

const fetcher = (resource: string | URL | Request) =>
  fetch(resource, { cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

interface ProvidersProps {
  children: ReactNode;
}

// Locale context to share state across components
export const LocaleContext = createContext<{
  locale: string;
  setLocale: (val: string) => void;
}>({
  locale: "en",
  setLocale: () => {},
});

export default function Providers({ children }: ProvidersProps) {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    const cookieLocale =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("NEXT_LOCALE="))
        ?.split("=")[1] || "en";

    setLocale(cookieLocale);

    import(`../../messages/${cookieLocale}.json`).then((mod) => {
      setMessages(mod.default);
    });
  }, []);

  useEffect(() => {
    import(`../../messages/${locale}.json`).then((mod) => {
      setMessages(mod.default);
      document.cookie = `NEXT_LOCALE=${locale}; path=/`;
    });
  }, [locale]);

  if (!messages) return null; // or a loading spinner

  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher: fetcher,
        keepPreviousData: true,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 2,
        fallback: {},
        suspense: false,
      }}
    >
      <LocaleContext.Provider value={{ locale, setLocale }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </LocaleContext.Provider>
    </SWRConfig>
  );
}
