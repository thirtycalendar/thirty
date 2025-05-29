<script lang="ts">
  import { CreateTask } from ".";

  import { taskModalId } from "$lib/stores/task";
  import { Modal } from "$lib/components";
</script>

<Modal modalId={taskModalId}><CreateTask /></Modal>
