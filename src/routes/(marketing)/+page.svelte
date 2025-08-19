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

<section class="mx-auto max-w-4xl px-3 pt-12 pb-6 text-center sm:pt-16 sm:pb-8">
  <h1 class="text-4xl font-bold sm:text-6xl">Open. Smart. Yours.</h1>
  <p class="mt-5 text-base opacity-75 sm:text-lg">
    Not reinventing the wheel, just improving your workflow with AI.
  </p>
</section>

<section class="p-5">
  <WaitingList />
</section>

<section class="mx-auto max-w-6xl px-4 py-16">
  <img
    src={isDark ? DemoDarkImage : DemoLightImage}
    alt="Dashboard Preview"
    class="ring-base-300 rounded-2xl shadow-2xl ring-6 sm:ring-10"
    loading="lazy"
  />
</section>

<div class="text-secondary-content flex justify-center gap-3 p-2 text-sm">
  <a href="/terms" class="hover:text-primary-content">Terms of Service</a>
  <a href="/privacy" class="hover:text-primary-content">Privacy Policy</a>
</div>
