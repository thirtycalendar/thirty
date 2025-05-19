<script lang="ts">
  let { children } = $props();
</script>

<div class="flex h-screen overflow-hidden">
  <!-- Left Sidebar -->
  <div class="w-[260px] shrink-0 bg-base-200 p-4">Left Sidebar</div>

  <!-- Main Content Area -->
  <div class="flex-1 overflow-y-auto p-4">
    {@render children()}
  </div>

  <!-- Right Sidebar -->
  <div class="w-[340px] shrink-0 bg-base-200 p-4">Right Sidebar</div>
</div>
