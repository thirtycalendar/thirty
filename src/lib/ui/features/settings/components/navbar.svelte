<script lang="ts">
  import { LogoutButton } from "$lib/ui/features/auth/components";
  import { ToggleSidebarIcon } from "$lib/ui/components";

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
