<script lang="ts">
  import { CreateTask } from ".";

  import { Modal } from "$lib/client/components";
  import { taskModalId } from "$lib/client/stores/task";
</script>

<Modal modalId={taskModalId}><CreateTask /></Modal>
