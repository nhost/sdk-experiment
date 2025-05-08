import { NextRequest, NextResponse } from "next/server";
import { createServerNhostClient } from "../lib/nhost/ssr";

export async function GET(request: NextRequest) {
  const refreshToken = request.nextUrl.searchParams.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.redirect(
      new URL("/verify/error?message=No+refresh+token+provided", request.url),
    );
  }

  try {
    const nhost = await createServerNhostClient();

    if (nhost.getUserSession()) {
      return NextResponse.redirect(
        new URL("/verify/error?message=Already signed in", request.url),
      );
    }

    await nhost.auth.refreshToken({ refreshToken });

    return NextResponse.redirect(new URL("/profile", request.url));
  } catch (error: any) {
    console.error("Token verification error:", error);

    let errorMessage = "Failed to verify token";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.redirect(
      new URL(
        `/verify/error?message=${encodeURIComponent(errorMessage)}`,
        request.url,
      ),
    );
  }
}
