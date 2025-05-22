<script lang="ts">
  import {
    ArrowLeftToLine,
    Calendar,
    MessagesSquareIcon,
  } from "@lucide/svelte";
</script>

<div class="flex items-center justify-between">
  <div>
    <div class="tooltip tooltip-bottom" data-tip="Hide">
      <button class="btn btn-square btn-ghost">
        <ArrowLeftToLine size="20" />
      </button>
    </div>
  </div>

  <div class="flex items-center gap-1">
    <div class="tooltip tooltip-bottom" data-tip="Chat">
      <button class={`btn btn-square btn-ghost `}>
        <MessagesSquareIcon size="20" />
      </button>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Calendar">
      <button class={`btn btn-square btn-ghost`}>
        <Calendar size="20" />
      </button>
    </div>
  </div>
</div>
