<script lang="ts">
  import { ToggleSidebarIcon } from "$lib/client/components";
  import { LogoutButton } from "$lib/client/features/auth/components";

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
