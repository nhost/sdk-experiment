import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createNhostClient } from "../lib/nhost/server";
import { FetchResponse, ErrorResponse } from "@nhost/nhost-js/auth";

export async function GET(request: NextRequest) {
  const refreshToken = request.nextUrl.searchParams.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.redirect(
      new URL("/verify/error?message=No+refresh+token+provided", request.url),
    );
  }

  try {
    const nhost = await createNhostClient();

    if (nhost.getUserSession()) {
      return NextResponse.redirect(
        new URL("/verify/error?message=Already signed in", request.url),
      );
    }

    await nhost.auth.refreshToken({ refreshToken });

    return NextResponse.redirect(new URL("/profile", request.url));
  } catch (err) {
    const error = err as FetchResponse<ErrorResponse>;
    const errorMessage = `Failed to verify token: ${error.body.message || "An error occurred during verification"}`;

    return NextResponse.redirect(
      new URL(
        `/verify/error?message=${encodeURIComponent(errorMessage)}`,
        request.url,
      ),
    );
  }
}
