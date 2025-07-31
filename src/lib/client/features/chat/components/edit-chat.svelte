<script lang="ts">
  import { FormActionButtons, InputField } from "$lib/client/components";
  import { chatModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createForm } from "$lib/client/utils/create-form";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { chatSchema } from "$lib/shared/schemas/chat";
  import type { Chat, ChatUpdateForm } from "$lib/shared/types";

  interface Props {
    chat: Chat;
  }

  let { chat }: Props = $props();

  let errorMessage = $state("");

  const defaultValues: ChatUpdateForm = {
    name: chat.name
  };

  const { formData, formErrors, isSubmitting, handleSubmit, handleInput } = createForm({
    schema: chatSchema,
    defaultValues,
    onSubmit
  });

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: ChatUpdateForm) => {
      const res = await client.api.chat.update[":id"].$put({
        param: { id: chat.id },
        json: formData
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";
      chatModal.currentDetails.set(data.data);

      showToast(data.message);
      chatModal.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["chat-list", "message-list"]
  });

  async function onSubmit(data: ChatUpdateForm) {
    await mutate(data);
  }
</script>

<form onsubmit={handleSubmit()} class="space-y-2 pt-3">
  {#if errorMessage}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <InputField name="name" {handleInput} {formData} {formErrors} />

  <FormActionButtons
    isCreate={false}
    isSaving={$isSubmitting || $isPending}
    isDisabled={$isSubmitting || $isPending}
    onCancel={chatModal.stopEditing}
  />
</form>
