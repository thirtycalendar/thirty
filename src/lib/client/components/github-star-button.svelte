<script lang="ts">
  import { onMount } from "svelte";

  import { StarIcon } from "@hugeicons/core-free-icons";

  import { Icon } from "./icons";

  import { AnimateNumber } from ".";

  let stars = $state(0);
  let loading = $state(true);

  const repo = "thirtycalendar/thirty";
  const href = `https://github.com/${repo}`;

  onMount(async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (!res.ok) throw new Error("Failed to fetch GitHub stars");
      const data = await res.json();
      stars = data.stargazers_count ?? 0;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

<a {href} target="_blank" class="btn btn-ghost btn-sm sm:btn-md font-normal">
  <Icon icon={StarIcon} size={18} absoluteStrokeWidth />

  {#if !loading}
    <AnimateNumber value={stars} />
  {:else}
    <span>0</span>
  {/if}
</a>
