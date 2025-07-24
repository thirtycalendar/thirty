<script lang="ts">
  import { Cake } from "@lucide/svelte";

  import { birthdayModal } from "$lib/client/stores/modal";

  import type { Birthday } from "$lib/shared/types";

  interface Props {
    birthday: Birthday;
  }

  let { birthday }: Props = $props();

  const hasBirthdaySuffix = /birthday$/i.test(birthday.name.trim());
  const name = hasBirthdaySuffix ? birthday.name : `${birthday.name}'s birthday`;
  const color = $derived(birthday.color);
</script>

<button
  class="text-primary-content w-full cursor-pointer select-none overflow-hidden rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-primary-content/10 shadow-sm p-0 text-left"
  style:background-color="{color}33"
  title={name}
  onclick={() => birthdayModal.handleModal(birthday)}
>
  <div class="w-1 h-full shrink-0" style:background-color={color}></div>
  <div class="p-0.5 overflow-hidden min-w-0 w-full text-xs font-medium">
    <div class="flex items-center gap-1 min-w-0">
      <Cake size="13" strokeWidth="2.5" class="flex-shrink-0" />
      <p class="truncate">{name}</p>
    </div>
  </div>
</button>
