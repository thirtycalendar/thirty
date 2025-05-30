<script lang="ts">
  import { GoogleIcon } from "$lib/client/components";
  import { createMutation } from "$lib/client/utils/query/create-mutation";

  import { googleAuth } from "../api";

  const { mutate, isSuccess, isPending } = createMutation({
    mutationFn: async () => {
      await googleAuth();
    }
  });

  async function onclick() {
    mutate();
  }
</script>

<button
  class="btn btn-lg btn-soft btn-info w-full my-2 font-semibold"
  {onclick}
  disabled={$isPending || $isSuccess}
>
  <GoogleIcon />
  <span class="text-sm sm:text-base">Continue with Google</span>
</button>
