<script lang="ts">
  import { InputField } from "$lib/client/components";
  import { chatModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createForm } from "$lib/client/utils/create-form";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { chatSchema } from "$lib/shared/schemas/chat";
  import type { Chat, ChatForm } from "$lib/shared/types";

  interface Props {
    chat: Chat;
  }

  let { chat }: Props = $props();

  let errorMessage = $state("");

  const defaultValues: ChatForm = {
    name: chat.name
  };

  const { formData, formErrors, isSubmitting, handleSubmit, handleInput } = createForm({
    schema: chatSchema,
    defaultValues,
    onSubmit
  });

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
      chatModal.currentDetails.set(data.data);

      showToast(data.message);
      chatModal.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["chat-list", "message-list"]
  });

  async function onSubmit(data: ChatForm) {
    await mutate(data);
  }
</script>

<form onsubmit={handleSubmit()} class="space-y-2 py-2">
  {#if errorMessage}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <InputField name="name" {handleInput} {formData} {formErrors} />

  <div class="flex justify-end gap-2">
    <button type="submit" class="btn btn-base-300 font-bold" disabled={$isSubmitting || $isPending}>
      {#if $isSubmitting || $isPending}
        <span class="loading loading-spinner loading-xs"></span>
      {/if}

      Save
    </button>
  </div>
</form>
