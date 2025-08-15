<script lang="ts">
  import { onMount } from "svelte";

  import { DiscordIcon } from "@hugeicons/core-free-icons";

  import { GithubStarButton, Seo, Toast } from "$lib/client/components";
  import { GoogleAuthButton } from "$lib/client/components/auth";
  import { Icon } from "$lib/client/components/icons";
  import { DemoDarkImage, DemoLightImage, LogoImage } from "$lib/client/assets";

  let { data } = $props();

  let isDark = $state(false);

  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    isDark = media.matches;

    const listener = (e: MediaQueryListEvent) => (isDark = e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  });

  const discordLink = "https://discord.gg/Y8XQ4dV4UC";
</script>

<Seo seo={data.seo} />

<Toast />

<div class="navbar bg-base-100 z-50 m-auto max-w-5xl">
  <div class="flex-1">
    <a href="/">
      <img src={LogoImage} alt="Thirty Logo" class="h-8 w-8" />
    </a>
  </div>

  <div class="flex items-center">
    <a href={discordLink} target="_blank" class="btn btn-ghost btn-square">
      <Icon icon={DiscordIcon} absoluteStrokeWidth />
    </a>

    <GithubStarButton />
  </div>
</div>

<section class="mx-auto max-w-4xl px-3 pt-20 pb-20 text-center">
  <h1 class="text-4xl font-bold sm:text-6xl">
    Your Calendar. Smarter, Open, and Always Listening.
  </h1>

  <p class="mt-6 text-lg opacity-80">
    Thirty is an open-source AI calendar you talk to, so you can focus on living, not scheduling.
  </p>

  <div class="mt-8 flex justify-center gap-3">
    <GoogleAuthButton
      label="Get Started →"
      class="btn btn-primary-content btn-lg flex min-w-[250px] items-center gap-2"
      showIcon={false}
    />
  </div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-20">
  <img
    src={isDark ? DemoDarkImage : DemoLightImage}
    alt="Dashboard Preview"
    class="ring-base-300 rounded-2xl shadow-2xl ring-10"
    loading="lazy"
  />
</section>

<div class="text-secondary-content flex justify-center gap-3 p-2 text-sm">
  <a href="/terms" class="hover:text-primary-content">Terms of Service</a>
  <a href="/privacy" class="hover:text-primary-content">Privacy Policy</a>
</div>
