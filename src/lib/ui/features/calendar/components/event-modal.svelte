<script lang="ts">
  import { CreateEvent } from ".";

  import { Modal } from "$lib/components";
  import { eventModalId } from "$lib/stores/event";
</script>

<Modal modalId={eventModalId} title="Event"><CreateEvent /></Modal>
