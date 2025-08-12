<script lang="ts">
  import { Navbar } from "$lib/client/components/calendar";
  import { cn } from "$lib/client/utils/cn";
</script>

<div class="flex">
  <!-- Sidebar -->
  <div>Sidebar</div>

  <!-- Calendar -->
  <div
    class={cn(
      "bg-base-100 my-1 ml-[220px] h-[calc(100vh-8px)] w-full overflow-hidden rounded-l-2xl p-3 transition-all duration-300"
    )}
  >
    <Navbar />

    Calendar
  </div>
</div>
