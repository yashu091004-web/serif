const LOOPS_API = "https://app.loops.so/api/v1";

type LoopsResult = {
  success: boolean;
  id?: string;
  message?: string;
};

async function upsertContact(
  payload: Record<string, unknown>
): Promise<LoopsResult> {
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    return { success: false, message: "Email service is not configured." };
  }
  try {
    const response = await fetch(`${LOOPS_API}/contacts/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as
      | LoopsResult
      | null;
    if (!response.ok || !data?.success) {
      return { success: false, message: data?.message ?? "Loops request failed." };
    }
    return data;
  } catch {
    return { success: false, message: "Could not reach the email service." };
  }
}

export function subscribeToNewsletter(email: string) {
  return upsertContact({ email, source: "blog" });
}

export function syncSignupContact(
  email: string,
  firstName: string | null,
  userId: string | null
) {
  const payload: Record<string, unknown> = {
    email,
    source: "serif-signup",
  };
  if (userId) payload.userId = userId;
  if (firstName) payload.firstName = firstName;
  return upsertContact(payload);
}
