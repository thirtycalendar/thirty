<script lang="ts">
  import { DiscordIcon } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { LogoImage } from "../../assets";
  import { Icon } from "../icons";

  import { GithubStarButton } from "..";

  const discordLink = "https://discord.gg/Y8XQ4dV4UC";

  let scrollY = $state(0);

  const scrolled = $derived(scrollY > 10);
</script>

<svelte:window bind:scrollY />

<div
  class={cn(
    "bg-base-100 fixed inset-x-0 top-0 z-50 mx-2 mt-2 max-w-4xl rounded-xl border px-3 py-3 transition-all duration-300 sm:mx-auto",
    scrolled ? "border-base-200 shadow-md" : "border-transparent"
  )}
>
  <div class="flex items-center justify-between">
    <div>
      <a href="/">
        <img src={LogoImage} alt="Thirty Logo" class="h-8 w-8" />
      </a>
    </div>

    <div class="flex items-center gap-2">
      <a href={discordLink} target="_blank" class="btn btn-ghost btn-square">
        <Icon icon={DiscordIcon} absoluteStrokeWidth />
      </a>

      <GithubStarButton />
    </div>
  </div>
</div>
