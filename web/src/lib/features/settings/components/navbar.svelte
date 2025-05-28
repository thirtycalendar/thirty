<script lang="ts">
  import { LogOut } from "@lucide/svelte";

  import { ToggleSidebarIcon } from "$lib/components";

  interface NavbarProps {
    title: string;
  }

  let { title }: NavbarProps = $props();

  function handleLogout() {}
</script>

<div class="flex items-center justify-between">
  <div class="flex gap-1 items-center">
    <ToggleSidebarIcon />
    <p class="text-xl font-semibold my-1">{title}</p>
  </div>

  <div>
    <button class="btn" onclick={handleLogout}>
      <div class="sm:hidden tooltip tooltip-bottom" data-tip="Logout">
        <LogOut size="18" />
      </div>

      <span class="hidden sm:flex">Logout</span>
    </button>
  </div>
</div>
