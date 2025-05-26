<script lang="ts">
  import { GoogleIcon } from "$lib/components";
  import { createMutation } from "$lib/utils/query/create-mutation";
  import { authClient } from "$lib/utils/rpc";

  async function googleAuth() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/calendar",
    });
  }

  const { mutate, isPending } = createMutation({
    mutationFn: async (input: string) => {
      console.log("Output:", input);
      await googleAuth();
    },
  });

  async function onclick() {
    mutate("Hello");
  }
</script>

<button
  class="btn btn-lg btn-soft btn-info w-full my-2 font-semibold"
  {onclick}
  disabled={$isPending}
>
  <GoogleIcon />
  Continue with Google
</button>
