<script lang="ts">
  import { CreateTask } from ".";

  import { Modal } from "$lib/client/components";
  import { taskCreateModalId } from "$lib/client/stores/task";
</script>

<Modal modalId={taskCreateModalId}><CreateTask /></Modal>
