<script lang="ts">
  import { CreditCardIcon, FolderSyncIcon, UserCircleIcon } from "@hugeicons/core-free-icons";
  import type { IconSvgElement } from "@hugeicons/svelte";

  import { settingsModalStore } from "$lib/client/stores/modal";
  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";

  import { Modal } from "..";
  import { Account, Billing, Sync } from ".";

  const { modalId } = settingsModalStore;

  type Item = {
    label: string;
    icon: IconSvgElement;
    onClick?: () => void;
  }[];

  const menuItems: Item = [
    // { label: "General", icon: Settings01Icon },
    { label: "Billing", icon: CreditCardIcon },
    { label: "Sync", icon: FolderSyncIcon },
    { label: "Account", icon: UserCircleIcon }
  ];

  type MenuItemLabel = (typeof menuItems)[number]["label"];
  let activeItem = $state<MenuItemLabel>(menuItems[0].label);
</script>

<Modal id={modalId} class="modal-open" modelBoxClass="p-0 m-0 !max-w-[650px]">
  <div class="bg-base-200 flex flex-col sm:flex-row">
    <!-- Sidebar -->
    <div class="flex w-full flex-row flex-wrap p-2 sm:w-[180px] sm:flex-col">
      {#each menuItems as item (item.label)}
        <button
          class={cn(
            "btn flex w-fit items-center justify-start gap-2 font-normal sm:w-full",
            activeItem === item.label ? "btn-active" : "btn-ghost"
          )}
          onclick={() => (activeItem = item.label)}
        >
          <Icon icon={item.icon} size={17} absoluteStrokeWidth />
          {item.label}
        </button>
      {/each}
    </div>

    <!-- Content -->
    <div
      class="bg-base-100 border-rounded m-1 mt-0 min-h-[450px] flex-1 overflow-y-scroll px-4 py-3 sm:mt-1 sm:ml-0"
    >
      <p class="text-base-content/80 mb-2 text-lg">{activeItem}</p>
      <hr class="text-base-300 my-3" />

      {#if activeItem === "Sync"}
        <Sync />
      {:else if activeItem === "Account"}
        <Account />
      {:else}
        <!-- <General /> -->
        <Billing />
      {/if}
    </div>
  </div>
</Modal>
