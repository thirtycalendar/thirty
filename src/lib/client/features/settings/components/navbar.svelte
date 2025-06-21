<script lang="ts">
  import { LogoutButton } from "$lib/client/features/auth/components";
  import { ToggleSidebarIcon } from "$lib/client/components";

  interface NavbarProps {
    title: string;
  }

  let { title }: NavbarProps = $props();
</script>

<div class="flex items-center justify-between">
  <div class="flex gap-1 items-center">
    <ToggleSidebarIcon />
    <p class="text-xl font-semibold my-1">{title}</p>
  </div>

  <div>
    <LogoutButton />
  </div>
</div>

<hr class="mt-2 mb-3 text-base-300" />
