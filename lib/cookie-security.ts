import { headers } from "next/headers";

type CookieSecurityInput = Readonly<{
  forwardedProto?: string | null;
  host?: string | null;
  nodeEnv?: string;
}>;

export function resolveSecureCookieSetting({
  forwardedProto,
  host,
  nodeEnv = process.env.NODE_ENV,
}: CookieSecurityInput) {
  const protocol = forwardedProto?.split(",")[0]?.trim().toLowerCase();
  if (protocol) {
    return protocol === "https";
  }

  const normalizedHost = host?.toLowerCase() ?? "";
  if (
    normalizedHost.startsWith("localhost") ||
    normalizedHost.startsWith("127.0.0.1") ||
    normalizedHost.startsWith("0.0.0.0") ||
    normalizedHost.startsWith("[::1]")
  ) {
    return false;
  }

  return nodeEnv === "production";
}

export async function shouldUseSecureCookie() {
  const headerStore = await headers();

  return resolveSecureCookieSetting({
    forwardedProto: headerStore.get("x-forwarded-proto"),
    host: headerStore.get("host"),
  });
}
