import { redirect } from "@sveltejs/kit";

import { authClient } from "./rpc";

export async function requireAuth() {
  const session = await authClient.getSession();

  console.log(session);

  if (!session) {
    redirect(302, "/auth");
  } else {
    console.log("Didn't pass...");
  }
}

export async function redirectIfAuthenticated() {
  const session = await authClient.getSession();

  if (session?.data?.user) {
    redirect(302, "/calendar");
  }
}
