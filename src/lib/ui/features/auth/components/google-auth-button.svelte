<script lang="ts">
  import { PUBLIC_BASE_URL } from "$env/static/public";

  import { createMutation } from "$lib/ui/utils/query/create-mutation";
  import { authClient } from "$lib/ui/utils/rpc";
  import { GoogleIcon } from "$lib/ui/components";

  async function googleAuth() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${PUBLIC_BASE_URL}/calendar`
    });
  }

  const { mutate, isSuccess, isPending, isError } = createMutation({
    mutationFn: async (input: string) => {
      console.log("Output:", input);
      await googleAuth();
    }
  });

  async function onclick() {
    mutate("Hello");
  }
</script>

<button
  class="btn btn-lg btn-soft btn-info w-full my-2 font-semibold"
  {onclick}
  disabled={$isPending || ($isSuccess && !$isError)}
>
  <GoogleIcon />
  Continue with Google
</button>
