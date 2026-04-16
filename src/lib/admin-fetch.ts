type AdminMutationOptions = Omit<RequestInit, "body" | "credentials"> & {
  body?: unknown;
};

export async function adminMutation(
  input: RequestInfo | URL,
  options: AdminMutationOptions = {},
) {
  const { body, ...rest } = options;
  const headers = new Headers(options.headers);
  headers.set("X-Requested-With", "XMLHttpRequest");

  const init: RequestInit = {
    ...rest,
    credentials: "same-origin",
    headers,
  };

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    init.body = JSON.stringify(body);
  }

  return fetch(input, init);
}
