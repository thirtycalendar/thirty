<script lang="ts">
  import { GoogleAuthButton } from "$lib/client/features/auth/components";
</script>

<div class="absolute top-1/3 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 p-5 sm:w-auto">
  <div
    class="bg-base-100 m-auto w-full space-y-6 rounded-2xl p-8 text-center shadow-2xl sm:w-[400px] md:p-10"
  >
    <div>
      <GoogleAuthButton />
      <p class="text-base-content mt-3 text-xs opacity-60">
        Secure sign-in with your Google account
      </p>
    </div>

    <p class="text-base-content text-xs opacity-50">
      By continuing, you agree to our
      <a href="/terms" class="underline">Terms</a>
      and <a href="/privacy" class="underline">Privacy Policy</a>.
    </p>
  </div>
</div>
