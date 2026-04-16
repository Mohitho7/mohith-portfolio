const SAFE_HTTP_PROTOCOLS = new Set(["http:", "https:"]);

function canParseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isSafeHttpUrl(value: string) {
  const parsed = canParseUrl(value);
  return parsed !== null && SAFE_HTTP_PROTOCOLS.has(parsed.protocol);
}

export function isSafeAssetUrl(value: string) {
  return value.startsWith("/") || isSafeHttpUrl(value);
}

export function isSafeNavigationHref(value: string) {
  return value.startsWith("#") || value.startsWith("/") || isSafeHttpUrl(value);
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

export function getSafeNavigationHref(
  value?: string | null,
  fallback = "/",
) {
  if (!value) {
    return fallback;
  }

  if (value.startsWith("#")) {
    return `/${value}`;
  }

  return isSafeNavigationHref(value) ? value : fallback;
}
