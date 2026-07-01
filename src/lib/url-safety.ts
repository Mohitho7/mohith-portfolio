const SAFE_HTTP_PROTOCOLS = new Set(["https:"]);
const SAFE_LOCALHOST_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

function canParseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isLocalhostUrl(parsed: URL) {
  return SAFE_LOCALHOST_HOSTNAMES.has(parsed.hostname);
}

export function isSafeHttpUrl(value: string) {
  const parsed = canParseUrl(value);

  if (!parsed) {
    return false;
  }

  if (parsed.protocol === "https:") {
    return true;
  }

  return parsed.protocol === "http:" && isLocalhostUrl(parsed);
}

export function isSafeAssetUrl(value: string) {
  return value.startsWith("/") || isSafeHttpUrl(value);
}

export function isSafeNavigationHref(value: string) {
  return value.startsWith("#") || value.startsWith("/") || isSafeHttpUrl(value);
}

export function sanitizeTextContent(value?: string | null) {
  if (!value) {
    return "";
  }

  const normalized = value.replace(/[\u0000-\u001f\u007f]/g, " ");
  const collapsed = normalized.replace(/\s+/g, " ").trim();

  return collapsed.replace(/[<>]/g, "");
}

export function getSafeAssetUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  return isSafeAssetUrl(value) ? value : null;
}

export function getSafeExternalHref(value?: string | null) {
  if (!value) {
    return null;
  }

  return isSafeHttpUrl(value) ? value : null;
}

export function getSafeNavigationHref(value?: string | null, fallback = "/") {
  if (!value) {
    return fallback;
  }

  if (value.startsWith("#")) {
    return `/${value}`;
  }

  return isSafeNavigationHref(value) ? value : fallback;
}
