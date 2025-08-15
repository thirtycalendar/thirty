import { goto } from "$app/navigation";

import { createMutation } from "$lib/client/utils/query/create-mutation";
import { authClient } from "$lib/client/utils/rpc";

export function createLogout() {
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
