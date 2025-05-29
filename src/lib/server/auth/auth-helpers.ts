import { redirect } from "@sveltejs/kit";

import { auth } from ".";

export async function requireAuth(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.session) {
    redirect(302, "/auth");
  }
}

export async function redirectIfAuthenticated(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (session?.session && session?.user) {
    redirect(302, "/calendar");
  }
}
