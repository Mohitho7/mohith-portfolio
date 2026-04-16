import "server-only";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { idParamSchema } from "@/lib/validations";

type AdminRequestOptions = {
  expectsJsonBody?: boolean;
};

const TRUSTED_FETCH_SITES = new Set(["same-origin", "same-site", "none"]);

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      error: "Invalid data",
      details: error.flatten(),
    },
    { status: 400 },
  );
}

export function invalidResourceIdResponse() {
  return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 });
}

export function notFoundResponse(resource = "Resource") {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function serverErrorResponse(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJsonBody(request: Request) {
  try {
    return {
      ok: true as const,
      data: (await request.json()) as unknown,
    };
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 },
      ),
    };
  }
}

export function validateResourceId(id: string) {
  return idParamSchema.safeParse(id);
}

function getAllowedOrigins(request: Request) {
  const allowedOrigins = new Set<string>();

  allowedOrigins.add(new URL(request.url).origin);

  if (process.env.NEXTAUTH_URL) {
    try {
      allowedOrigins.add(new URL(process.env.NEXTAUTH_URL).origin);
    } catch {
      // Ignore malformed deployment config and fall back to the request origin.
    }
  }

  return allowedOrigins;
}

export async function requireAdminRequest(
  request: Request,
  options: AdminRequestOptions = {},
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const requestedWith = request.headers.get("x-requested-with");
  if (requestedWith !== "XMLHttpRequest") {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Invalid request context" },
        { status: 403 },
      ),
    };
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !TRUSTED_FETCH_SITES.has(fetchSite)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 }),
    };
  }

  const origin = request.headers.get("origin");
  const allowedOrigins = getAllowedOrigins(request);

  if (!origin || !allowedOrigins.has(origin)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Origin validation failed" },
        { status: 403 },
      ),
    };
  }

  if (options.expectsJsonBody) {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

    if (!contentType.startsWith("application/json")) {
      return {
        ok: false as const,
        response: NextResponse.json(
          { error: "Content-Type must be application/json" },
          { status: 415 },
        ),
      };
    }
  }

  return {
    ok: true as const,
    session,
  };
}
