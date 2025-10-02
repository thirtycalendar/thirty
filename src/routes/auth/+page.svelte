<script>
  import { GoogleIcon } from "$lib/client/icons";
  import { googleAuth } from "$lib/client/queries/auth.remote";

  async function handleGoogleAuth() {
    await googleAuth();
  }
</script>

<div class="absolute top-1/3 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 p-5 sm:w-auto">
  <div
    class="bg-base-300/20 border-base border-rounded m-auto w-full space-y-5 p-8 text-center sm:w-[400px] md:p-10"
  >
    <input type="text" placeholder="me@example.com" class="input w-full outline-none" />

    <button
      class="btn bg-primary-content hover:bg-accent-content/85 text-primary border-base w-full font-normal"
    >
      Login
    </button>

    <div class="divider text-sm opacity-50">or</div>

    <button class="btn border-base w-full font-normal" onclick={handleGoogleAuth}>
      <GoogleIcon />
      <span>Continue with Google</span>
    </button>
  </div>

  <p class="mt-5 text-center text-xs opacity-50">
    By continuing, you agree to our
    <a href="/terms" class="underline">Terms</a>
    and <a href="/privacy" class="underline">Privacy Policy</a>.
  </p>
</div>
