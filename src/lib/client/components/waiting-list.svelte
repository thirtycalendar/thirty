<script lang="ts">
  import { onMount } from "svelte";

  import { waitingListSchema } from "$lib/shared/schemas/waiting-list";
  import type { WaitingListForm } from "$lib/shared/types";

  import { createForm } from "../utils/create-form";
  import { createMutation } from "../utils/query/create-mutation";
  import { client } from "../utils/rpc";
  import { InputField } from "./form";

  let message = $state("");
  let errorMessage = $state("");

  const { mutate, isPending } = createMutation({
    mutationFn: async (formData: WaitingListForm) => {
      const res = await client.api.waitingList.add.$post({ json: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onSuccess: (data) => {
      message = data.message;
      errorMessage = "";
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
      message = "";
    },
    queryKeys: ["waiting-list"]
  });

  const { formData, formErrors, handleSubmit, handleInput } = createForm({
    schema: waitingListSchema,
    defaultValues: {
      email: ""
    },
    onSubmit: async (data) => {
      await mutate(data);
    }
  });

  onMount(() => {
    message = "";
    errorMessage = "";

    return () => {
      message = "";
      errorMessage = "";
    };
  });
</script>

<div class="text-center">
  <div class="m-auto max-w-sm">
    <form onsubmit={handleSubmit()} class="flex w-full items-baseline gap-2 sm:gap-3">
      <InputField
        name="email"
        placeholder="example@your.com"
        class="sm:input-lg w-full flex-1"
        {handleInput}
        {formData}
        {formErrors}
      />

      <button type="submit" class="btn sm:btn-lg font-normal" disabled={$isPending}>
        {#if $isPending}
          <span class="loading loading-spinner loading-xs"></span>
        {/if}
        Join
      </button>
    </form>
  </div>

  {#if message}
    <p class="text-success my-2 text-sm">{message}</p>
  {:else if errorMessage}
    <p class="text-error my-2 text-sm">{errorMessage}</p>
  {/if}
</div>
