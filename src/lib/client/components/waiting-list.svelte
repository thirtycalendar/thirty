<script lang="ts">
  import { onMount } from "svelte";

  import { waitingListSchema } from "$lib/shared/schemas/waiting-list";
  import type { WaitingListForm } from "$lib/shared/types";

  import { createForm } from "../utils/create-form";
  import { createMutation } from "../utils/query/create-mutation";
  import { createQuery } from "../utils/query/create-query";
  import { client } from "../utils/rpc";
  import { InputField } from "./form";

  import { AnimateNumber } from ".";

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

      setTimeout(() => {
        message = "";
      }, 3000);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
      message = "";
    },
    queryKeys: ["waiting-list-count"]
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

  const { data } = createQuery({
    queryFn: async () => {
      const res = await client.api.waitingList.count.$get();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.data;
    },
    queryKeys: ["waiting-list-count"],
    staleTime: Number.POSITIVE_INFINITY
  });
</script>

<div class="space-y-2 text-center">
  <div class="relative h-4">
    {#if message}
      <p class="text-success absolute inset-0 text-sm">{message}</p>
    {:else if errorMessage}
      <p class="text-error absolute inset-0 text-sm">{errorMessage}</p>
    {/if}
  </div>

  <div class="m-auto max-w-[450px]">
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
        Join Now
      </button>
    </form>
  </div>

  {#if $data}
    <div class="text-success mt-3 flex items-center justify-center gap-1.5">
      <div class="inline-grid *:[grid-area:1/1]">
        <div class="status status-success animate-ping"></div>
        <div class="status status-success"></div>
      </div>

      <div>
        <span class="font-semibold">
          <AnimateNumber value={$data.count} />
        </span>
        {#if $data.count === 1}
          person is on the list already.
        {:else if $data.count < 50}
          people are getting in early.
        {:else}
          people are waiting for launch.
        {/if}
      </div>
    </div>
  {/if}
</div>
