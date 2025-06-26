<script lang="ts">
  import { CreateEvent } from ".";

  import { Modal } from "$lib/client/components";
  import { eventCreateModalId } from "$lib/client/stores/event";
</script>

<Modal modalId={eventCreateModalId} title="Event"><CreateEvent /></Modal>
