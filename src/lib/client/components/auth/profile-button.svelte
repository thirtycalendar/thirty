<script lang="ts">
  import {
    DiscordIcon,
    Logout05Icon,
    Settings01Icon,
    SparklesIcon
  } from "@hugeicons/core-free-icons";
  import type { IconSvgElement } from "@hugeicons/svelte";

  import { checkoutMutation, logoutMutation } from "$lib/client/data/mutations";
  import { settingsModalStore } from "$lib/client/stores/modal";
  import { session } from "$lib/client/stores/user-session";

  import { discordLink } from "$lib/shared/config";

  import { Icon } from "../icons";
  import { toggleModal } from "../utils";

  const { mutate: handleLogout, isPending: logoutIsPending } = logoutMutation();
  const { mutate: handleUpgrade, isPending: checkoutIsPending } = checkoutMutation();

  type Item = {
    label: string;
    icon: IconSvgElement;
    onclick?: () => void;
    disabled?: boolean;
  }[];

  function handleSettings() {
    toggleModal(settingsModalStore.modalId);
  }

  const menuItems: Item = [
    {
      label: "Upgrade plan",
      icon: SparklesIcon,
      onclick: handleUpgrade,
      disabled: $checkoutIsPending
    },
    { label: "Discord", icon: DiscordIcon, onclick: () => window.open(discordLink, "_blank") },
    { label: "Settings", icon: Settings01Icon, onclick: handleSettings },
    { label: "Log out", icon: Logout05Icon, onclick: handleLogout, disabled: $logoutIsPending }
  ];
</script>

{#if $session}
  <div class="dropdown dropdown-end">
    <button tabindex="0" aria-label="User Profile" class="btn btn-circle">
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
            item.onclick?.();
            (document.activeElement as HTMLElement)?.blur();
          }}
          disabled={item.disabled}
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
