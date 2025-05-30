import { authClient } from "$lib/client/utils/rpc";

export async function googleAuth() {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: "/calendar"
  });

  if (data.error) {
    throw new Error(data.error.message);
  }
}
