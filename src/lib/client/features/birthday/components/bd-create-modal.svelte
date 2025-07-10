<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { eventCreateModalId } from "$lib/client/stores/event";

  import { CreateBd } from ".";
</script>

<Modal modalId={eventCreateModalId} title="Birthday"><CreateBd /></Modal>
