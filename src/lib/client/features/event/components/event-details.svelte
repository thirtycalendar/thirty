<script lang="ts">
  import type { Event } from "$lib/types";

  interface EventDetailsProps {
    event: Event;
  }

  let { event }: EventDetailsProps = $props();
</script>

<p>{event.name}</p>
