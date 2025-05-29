<script lang="ts">
  import { CreateEvent } from ".";

  import { eventModalId } from "$lib/ui/stores/event";
  import { Modal } from "$lib/ui/components";
</script>

<Modal modalId={eventModalId} title="Event"><CreateEvent /></Modal>
