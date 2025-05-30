<script lang="ts">
  import { CreateEvent } from ".";

  import { Modal } from "$lib/client/components";
  import { eventModalId } from "$lib/client/stores/event";
</script>

<Modal modalId={eventModalId} title="Event"><CreateEvent /></Modal>
