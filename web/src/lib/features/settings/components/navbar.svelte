<script lang="ts">
  import { ToggleSidebarIcon } from "$lib/components";

  interface NavbarProps {
    title: string;
  }

  let { title }: NavbarProps = $props();
</script>

<div>
  <div class="flex gap-1 items-center">
    <ToggleSidebarIcon />
    <p class="text-xl font-semibold my-1">{title}</p>
  </div>
</div>
