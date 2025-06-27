<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { eventCreateModalId } from "$lib/client/stores/event";

  import { CreateEvent } from ".";
</script>

<Modal modalId={eventCreateModalId} title="Event"><CreateEvent /></Modal>
