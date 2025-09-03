<script lang="ts">
  import { onMount } from "svelte";

  import { Seo, WaitingList } from "$lib/client/components";
  import { DemoDarkImage, DemoLightImage } from "$lib/client/assets";

  let { data } = $props();
  let isDark = $state(false);

  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    isDark = media.matches;
    const listener = (e: MediaQueryListEvent) => (isDark = e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  });
</script>

<Seo seo={data.seo} />

<div class="mx-auto mt-12 mb-6 max-w-4xl px-3 text-center sm:mt-16 sm:mb-8">
  <h1 class="text-4xl font-bold sm:text-8xl">The AI Calendar</h1>
  <p class="mt-5 text-base opacity-75 sm:text-lg">
    Not reinventing the wheel, just improving your workflow with AI.
  </p>
</div>

<div class="my-8 px-5">
  <WaitingList />
</div>

<div class="mx-auto my-16 max-w-6xl px-4">
  <img
    src={isDark ? DemoDarkImage : DemoLightImage}
    alt="Thirty - AI Calendar dashboard preview"
    class="ring-base-300 rounded-2xl shadow-2xl ring-8 sm:ring-10"
    loading="eager"
    fetchpriority="high"
  />
</div>

<div class="text-secondary-content my-4 flex justify-center gap-3 text-sm">
  <a href="/terms" class="hover:text-primary-content">Terms of Service</a>
  <a href="/privacy" class="hover:text-primary-content">Privacy Policy</a>
</div>
