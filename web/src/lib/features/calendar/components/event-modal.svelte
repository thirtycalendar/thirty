<script lang="ts">
  import { CreateEvent } from ".";

  import { eventModalId } from "$lib/stores/event";
  import { Modal } from "$lib/components";
</script>

<Modal modalId={eventModalId} title="Event"><CreateEvent /></Modal>
