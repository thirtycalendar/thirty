<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  let defaultCalView = $state("week");

  function handleCalViewChange(event: Event) {
    const { name } = event.target as HTMLInputElement;
    console.log(name);
  }
</script>

<div class="flex justify-between items-center py-3">
  <div>
    <p>May 21, 2025</p>
  </div>

  <div class="tabs tabs-box bg-base-300">
    <input
      type="radio"
      name="month"
      aria-label="Month"
      onclick={handleCalViewChange}
      class="tab"
    />
    <input
      type="radio"
      name="week"
      aria-label="Week"
      onclick={handleCalViewChange}
      class="tab"
    />
    <input
      type="radio"
      name="day"
      aria-label="Day"
      onclick={handleCalViewChange}
      class="tab"
    />
  </div>

  <div>
    <button>
      <ChevronLeft size="25px" />
    </button>

    <button>Today</button>

    <button>
      <ChevronRight size="25px" />
    </button>
  </div>
</div>
