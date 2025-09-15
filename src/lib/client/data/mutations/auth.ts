import { goto } from "$app/navigation";

import { showToast } from "$lib/client/stores/toast";
import { createMutation } from "$lib/client/utils/query/create-mutation";
import { authClient } from "$lib/client/utils/rpc";

export function authMutation() {
  return createMutation({
    mutationFn: async () => {
      const data = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/calendar"
      });

      if (data.error) {
        throw new Error(data.error.message);
      }
    },
    onError: (message: Error["message"]) => {
      showToast(message, true);
    }
  });
}

export function logoutMutation() {
  return createMutation({
    mutationFn: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            localStorage.removeItem("user-session");
            goto("/auth");
          }
        }
      });
    }
  });
}

export function logoutAllMutation() {
  return createMutation({
    mutationFn: async () => {
      await authClient.revokeSessions({
        fetchOptions: {
          onSuccess: () => {
            localStorage.removeItem("user-session");
            goto("/auth");
          }
        }
      });
    }
  });
}
