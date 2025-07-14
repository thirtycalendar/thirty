<script lang="ts">
  import { onDestroy } from "svelte";

  import { Trash } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { HolidayCountry } from "$lib/shared/types";

  interface Props {
    holidayCountry: HolidayCountry;
    errorMessage: string;
  }

  let { holidayCountry, errorMessage = $bindable() }: Props = $props();

  let confirmDelete = $state(false);

  function onclick() {
    confirmDelete = !confirmDelete;
  }

  let { mutate, isPending } = createMutation({
    mutationFn: async () => {
      const res = await client.api.holiday.country.remove.$delete({ json: holidayCountry });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      confirmDelete = false;

      toggleModal(holidayCountry.id);
      showToast(data.message);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["hd-list", "hd-country-list", "all-hd-country-list"]
  });

  function handleDelete() {
    mutate();
  }

  onDestroy(() => {
    confirmDelete = false;
  });
</script>

{#if confirmDelete}
  <p class="text-xs text-error text-right mr-2">Are you sure?</p>
{/if}

<div class="flex justify-end">
  {#if confirmDelete}
    <div>
      <button class="btn btn-sm btn-neutral text-xs mr-1" {onclick} disabled={$isPending}>
        No
      </button>
      <button
        class="btn btn-sm btn-error text-xs mr-1"
        onclick={handleDelete}
        disabled={$isPending}
      >
        Yes
      </button>
    </div>
  {:else}
    <button class="btn btn-sm btn-square btn-ghost hover:bg-error" {onclick}>
      <Trash size="17" />
    </button>
  {/if}
</div>
