<script lang="ts">
  import { Modal } from "$lib/components";
  import { eventModalId } from "$lib/stores/event";

  import { CreateEvent } from ".";
</script>

<Modal modalId={eventModalId} title="Event"><CreateEvent /></Modal>
