import { NextResponse } from "next/server";
import { syncSignupContact } from "@/lib/loops";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: {
    email?: unknown;
    firstName?: unknown;
    userId?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const email =
    typeof payload.email === "string"
      ? payload.email.trim().toLowerCase()
      : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (!process.env.LOOPS_API_KEY) {
    return NextResponse.json({ success: false }, { status: 200 });
  }

  const firstName =
    typeof payload.firstName === "string" && payload.firstName.trim()
      ? payload.firstName.trim().slice(0, 80)
      : null;
  const userId =
    typeof payload.userId === "string" && payload.userId.trim()
      ? payload.userId.trim().slice(0, 128)
      : null;

  const result = await syncSignupContact(email, firstName, userId);
  return NextResponse.json({ success: result.success });
}
