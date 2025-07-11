<script lang="ts">
  import { Cake } from "@lucide/svelte";

  import { handleBirthdayModal } from "$lib/client/stores/birthday";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Birthday } from "$lib/shared/types";

  interface Props {
    birthday: Birthday;
  }

  let { birthday }: Props = $props();

  const bdColor = $derived(getColorHexCodeFromId(birthday.colorId));
</script>

<button
  class="text-primary-content w-full cursor-pointer select-none overflow-hidden rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-primary-content/10 shadow-sm p-0 text-left"
  style:background-color="{bdColor}33"
  title={birthday.name}
  onclick={() => handleBirthdayModal(birthday)}
>
  <div class="w-1 h-full shrink-0" style:background-color={bdColor}></div>
  <div class="p-0.5 overflow-hidden min-w-0 w-full text-xs font-medium">
    <div class="flex items-center gap-1">
      <Cake size="13" strokeWidth="2.5" />
      <p class="truncate">{birthday.name}'s birthday</p>
    </div>
  </div>
</button>
