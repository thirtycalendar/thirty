<script lang="ts">
  import { onMount } from "svelte";

  import { GoogleAuthButton } from "$lib/client/features/auth/components";
  import { Seo } from "$lib/client/components";
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

  const githubUrl = "https://github.com/thirtycalendar/thirty";
</script>

<Seo seo={data.seo} />

<div class="navbar bg-base-100 fixed top-0 right-0 left-0 z-50 m-auto max-w-5xl">
  <div class="flex-1">
    <a href="/" class="flex items-center gap-1 text-xl font-bold">
      <img src={LogoImage} alt="Thirty Logo" class="h-8 w-8" />
    </a>
  </div>

  <div>
    <a href={githubUrl} target="_blank" class="btn btn-outline btn-sm sm:btn">⭐ Star on GitHub</a>
  </div>
</div>

<section class="mx-auto max-w-2xl px-3 pt-32 pb-20 text-center">
  <h1 class="text-4xl font-bold sm:text-5xl">
    Your Calendar. Smarter, Open, and Always Listening.
  </h1>
  <p class="mt-4 text-lg opacity-70">
    Thirty is the open AI calendar you talk to, and it organizes your life.
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
