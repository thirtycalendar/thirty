<script lang="ts">
  import { GoogleIcon } from "$lib/components";

  // onMount(() => {
  //   isAuthLoading.set(false);
  //   authSuccessMessage.set("");
  //   authErrorMessage.set("");
  // });

  async function onclick() {
    // await googleAuth();
  }
</script>

<!-- <p class="text-sm my-2 {$authErrorMessage ? 'text-error' : 'text-success'}">
  {$authErrorMessage || $authSuccessMessage}
</p> -->

<button
  class="btn btn-lg btn-soft btn-info w-full my-2 font-semibold"
  {onclick}
>
  <GoogleIcon />
  Continue with Google
</button>
