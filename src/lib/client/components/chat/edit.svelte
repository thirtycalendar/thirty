<script lang="ts">
  import { chatDetailsModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createForm } from "$lib/client/utils/create-form";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { chatSchema } from "$lib/shared/schemas";
  import type { Chat, ChatForm } from "$lib/shared/types";

  import { FormActionButtons, InputField } from "../form";

  interface Props {
    chat: Chat;
  }

  let { chat }: Props = $props();

  let errorMessage = $state("");

  const defaultValues: ChatForm = {
    userId: chat.userId,
    name: chat.name
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: ChatForm) => {
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
      chatDetailsModalStore.activeItem.set(data.data);

      showToast(data.message);
      chatDetailsModalStore.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["chats"]
  });

  async function onSubmit(data: ChatForm) {
    await mutate(data);
  }

  const { formData, formErrors, isSubmitting, handleInput, handleSubmit } = createForm({
    schema: chatSchema,
    defaultValues,
    onSubmit
  });
</script>

<form onsubmit={handleSubmit()} class="form-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <!-- Name -->
  <InputField name="name" placeholder="Chat title" {handleInput} {formData} {formErrors} />

  <!-- Form Actions -->
  <FormActionButtons
    isCreate={false}
    isSaving={$isSubmitting || $isPending}
    isDisabled={$isSubmitting || $isPending}
    onCancel={chatDetailsModalStore.stopEditing}
  />
</form>
