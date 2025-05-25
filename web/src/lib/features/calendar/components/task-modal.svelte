<script lang="ts">
  import { Modal } from "$lib/components";
  import { taskModalId } from "$lib/stores/task";

  import { CreateTask } from ".";
</script>

<Modal modalId={taskModalId}><CreateTask /></Modal>
