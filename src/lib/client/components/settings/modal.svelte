<script lang="ts">
  import { settingsModalStore } from "$lib/client/stores/modal";

  import { Modal } from "..";

  const { modalId } = settingsModalStore;
</script>

<Modal id={modalId} class="modal-open">Hello</Modal>
