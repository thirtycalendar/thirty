<script lang="ts">
  import { onMount } from "svelte";

  import { DiscordIcon, GithubIcon } from "@hugeicons/core-free-icons";

  import { authMutation } from "$lib/client/data/mutations";
  import { cn } from "$lib/client/utils/cn";

  import { discordLink, githubLink } from "$lib/shared/config";

  import { LogoDarkImage, LogoWhiteImage } from "../../assets";
  import { Icon } from "../icons";

  // import { GithubStarButton } from "..";

  let scrollY = $state(0);

  const scrolled = $derived(scrollY > 10);

  let isDark = $state(false);

  const { mutate: handleAuth, isPending } = authMutation();

  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    isDark = media.matches;
    const listener = (e: MediaQueryListEvent) => (isDark = e.matches);
    media.addEventListener("change", listener);
    return function cleanup() {
      media.removeEventListener("change", listener);
    };
  });
</script>

<svelte:window bind:scrollY />

<div
  class={cn(
    "bg-base-100 fixed inset-x-0 top-0 z-50 mx-2 mt-2 max-w-5xl rounded-xl border px-3 py-3 transition-all duration-300 md:mx-auto",
    scrolled ? "border-base-200 shadow-md" : "border-transparent"
  )}
>
  <div class="flex items-center justify-between">
    <a href="/">
      <img
        src={isDark ? LogoWhiteImage : LogoDarkImage}
        alt="Thirty Logo"
        class="h-8 w-8 opacity-85 transition-all duration-300 hover:opacity-100"
      />
    </a>

    <div class="flex items-center gap-2">
      <a
        href={discordLink}
        target="_blank"
        rel="noopener noreferrer external"
        class="btn btn-ghost btn-square"
      >
        <Icon icon={DiscordIcon} absoluteStrokeWidth />
      </a>

      <!-- <GithubStarButton /> -->
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer external"
        class="btn btn-ghost btn-square"
      >
        <Icon icon={GithubIcon} size={18} absoluteStrokeWidth />
      </a>

      <button
        class="btn bg-primary-content text-primary hover:bg-primary-content/90 disabled: disabled:text-primary-content/30 transition-all"
        onclick={handleAuth}
        disabled={$isPending}
      >
        Get Started
      </button>
    </div>
  </div>
</div>
