import { get } from "svelte/store";

import { PUBLIC_API } from "$env/static/public";
import type { Session, User } from "better-auth";

import type { SuccessResponse } from "$lib/types";

import { createQuery } from "./query/create-query";

interface SuccessType {
  session: Session;
  user: User;
}

export async function requireAuth() {
  const { data } = createQuery<SuccessType>({
    queryFn: async () => {
      const res = await fetch(`${PUBLIC_API}/authorize/current`, {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) {
        console.error("Failed to authorize", res.status);
        throw new Error("Unauthorized");
      }

      const json = (await res.json()) as SuccessResponse<SuccessType>;

      return {
        session: json.data.session,
        user: json.data.user
      };
    }
  });

  const user = get(data)?.user;
  console.log("data user", user);
}
