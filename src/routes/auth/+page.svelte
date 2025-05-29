<script lang="ts">
  import { GoogleAuthButton } from "$lib/ui/features/auth/components";
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
  <div class="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl p-8 md:p-10 text-center space-y-6">
    <div>
      <GoogleAuthButton />
      <p class="text-xs text-base-content mt-3 opacity-60">
        Secure sign-in with your Google account
      </p>
    </div>

    <p class="text-xs text-base-content opacity-50">
      By continuing, you agree to our
      <a href="/terms" class="underline">Terms</a>
      and <a href="/privacy" class="underline">Privacy Policy</a>.
    </p>
  </div>
</div>
