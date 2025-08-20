<script lang="ts">
  import {
    DiscordIcon,
    Logout05Icon,
    Settings01Icon,
    SparklesIcon
  } from "@hugeicons/core-free-icons";
  import type { IconSvgElement } from "@hugeicons/svelte";

  import { createLogout } from "$lib/client/data/mutations";
  import { session } from "$lib/client/stores/user-session";

  import { Icon } from "../icons";

  const { mutate: handleLogout, isPending } = createLogout();

  type Item = {
    label: string;
    icon: IconSvgElement;
    onClick?: () => void;
  }[];

  const menuItems: Item = [
    { label: "Upgrade plan", icon: SparklesIcon },
    { label: "Discord", icon: DiscordIcon },
    { label: "Settings", icon: Settings01Icon },
    { label: "Logout", icon: Logout05Icon, onClick: handleLogout }
  ];
</script>

{#if $session}
  <div class="dropdown dropdown-end">
    <button aria-label="User Profile" class="btn btn-circle">
      <img
        src={$session.image}
        referrerpolicy="no-referrer"
        alt=""
        class="border-base-300 w-8 rounded-full border-2"
      />
    </button>

    <ul class="dropdown-content menu bg-base-100 rounded-box border-base-200 mt-1 w-auto border">
      {#each menuItems as item (item.label)}
        {#if item.label === "Logout"}
          <div class="divider m-0 p-0 before:h-0.5 after:h-0.5"></div>
        {/if}

        <button
          class="btn btn-sm sm:btn-md btn-ghost flex w-full items-center justify-start gap-3 font-normal whitespace-nowrap"
          onclick={() => {
            item.onClick?.();
            (document.activeElement as HTMLElement)?.blur();
          }}
          disabled={item.label === "Logout" && $isPending}
        >
          <span>
            <Icon icon={item.icon} size={17} absoluteStrokeWidth />
          </span>
          {item.label}
        </button>
      {/each}
    </ul>
  </div>
{/if}
