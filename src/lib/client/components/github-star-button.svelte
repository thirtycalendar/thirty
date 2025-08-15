<script lang="ts">
  import { StarIcon } from "@hugeicons/core-free-icons";

  import { createQuery } from "../utils/query/create-query";
  import { Icon } from "./icons";

  import { AnimateNumber } from ".";

  const repo = "thirtycalendar/thirty";
  const href = `https://github.com/${repo}`;

  const { data } = createQuery({
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (!res.ok) throw new Error("Failed to fetch GitHub stars");

      const data = await res.json();
      return (data.stargazers_count as number) ?? 0;
    },
    queryKeys: ["github-stars"],
    staleTime: Number.POSITIVE_INFINITY
  });
</script>

<a {href} target="_blank" class="btn btn-ghost btn-sm sm:btn-md font-normal">
  <Icon icon={StarIcon} size={18} absoluteStrokeWidth />

  {#if $data}
    <AnimateNumber value={$data} />
  {/if}
</a>
