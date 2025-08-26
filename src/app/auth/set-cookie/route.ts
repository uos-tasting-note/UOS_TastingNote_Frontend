// app/api/auth/set-cookie/route.ts
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing token" }),
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7d
    });

    return Response.json({ ok: true });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
