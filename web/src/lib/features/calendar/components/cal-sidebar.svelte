<script lang="ts">
  import { SidebarMenu } from "$lib/components";

  interface CalSidebarProps {
    mainSidebarId: string;
  }

  let { mainSidebarId }: CalSidebarProps = $props();
</script>

<SidebarMenu {mainSidebarId} />
