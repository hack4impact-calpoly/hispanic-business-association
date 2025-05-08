import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"; // fallback to 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
