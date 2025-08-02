<script lang="ts">
  import { LogoutButton } from "$lib/client/features/auth/components";
  import { ToggleSidebarIcon } from "$lib/client/components";

  interface Props {
    title: string;
  }

  let { title }: Props = $props();
</script>

<div class="flex items-center justify-between">
  <div class="flex items-center gap-1">
    <ToggleSidebarIcon />
    <p class="my-1 text-xl font-semibold">{title}</p>
  </div>

  <div>
    <LogoutButton />
  </div>
</div>

<hr class="text-base-300 mt-2 mb-3" />
