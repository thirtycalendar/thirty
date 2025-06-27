<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { eventModalId } from "$lib/client/stores/event";

  import type { Event } from "$lib/types";

  import { EventDetails } from ".";

  interface EventModalProps {
    event: Event;
  }

  let { event }: EventModalProps = $props();
</script>

<Modal modalId={eventModalId} title="Event"><EventDetails {event} /></Modal>
