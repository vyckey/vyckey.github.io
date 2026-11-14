export interface UrlQueryParam {
  key: string;
  value: string;
}

export interface ParsedUrl {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  params: UrlQueryParam[];
}

/**
 * Parse an absolute URL. When the scheme is missing, `https://` is assumed so
 * users can paste `example.com/path` directly.
 */
export function parseUrl(input: string): ParsedUrl | null {
  const value = input.trim();
  if (!value) {
    return null;
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  const hasAuthority = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
  // Treat `example.com:8080` as host:port, not as a scheme.
  const hostWithPort = /^[^/\s:]+:\d+(?:[/?#].*)?$/.test(value);

  if (hasScheme && !hasAuthority && !hostWithPort) {
    return null;
  }

  const candidate = hasAuthority ? value : `https://${value}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  return {
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    hash: url.hash,
    params: Array.from(url.searchParams.entries()).map(([key, paramValue]) => ({
      key,
      value: paramValue,
    })),
  };
}

export function buildUrl(parts: ParsedUrl): string {
  const protocol = parts.protocol.endsWith(':')
    ? parts.protocol
    : `${parts.protocol}:`;
  const auth = parts.username
    ? `${parts.username}${parts.password ? `:${parts.password}` : ''}@`
    : '';
  const host = `${parts.hostname}${parts.port ? `:${parts.port}` : ''}`;
  const pathname = parts.pathname || '/';
  const search = parts.params
    .filter(param => param.key || param.value)
    .map(
      param =>
        `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
    )
    .join('&');
  const hash = parts.hash
    ? parts.hash.startsWith('#')
      ? parts.hash
      : `#${parts.hash}`
    : '';

  return `${protocol}//${auth}${host}${pathname}${search ? `?${search}` : ''}${hash}`;
}
