<script lang="ts">
  import { DiscordIcon } from "@hugeicons/core-free-icons";

  import { LogoImage } from "../../assets";
  import { Icon } from "../icons";

  import { GithubStarButton } from "..";

  const discordLink = "https://discord.gg/Y8XQ4dV4UC";
</script>

<div class="navbar bg-base-100 z-50 m-auto max-w-5xl p-3">
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
