<script>
  import { ChevronLeftIcon, GoogleIcon } from "$lib/client/icons";
  import { googleAuth } from "$lib/client/queries/auth.remote";

  const greetings = ["Welcome", "Hello", "Hi"];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  async function handleGoogleAuth() {
    await googleAuth();
  }
</script>

<a href="/" class="btn btn-ghost btn-square m-2">
  <ChevronLeftIcon />
</a>

<div class="absolute top-1/3 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 p-5 sm:w-sm">
  <div class="m-auto w-full text-center">
    <h2 class="mb-4 text-xl font-semibold">{greeting}</h2>

    <fieldset class="fieldset mb-4">
      <legend class="fieldset-legend text-left">Email</legend>
      <input type="text" placeholder="me@example.com" class="input w-full focus:outline-none" />
    </fieldset>

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
