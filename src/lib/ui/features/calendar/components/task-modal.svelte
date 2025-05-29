<script lang="ts">
  import { CreateTask } from ".";

  import { taskModalId } from "$lib/ui/stores/task";
  import { Modal } from "$lib/ui/components";
</script>

<Modal modalId={taskModalId}><CreateTask /></Modal>
