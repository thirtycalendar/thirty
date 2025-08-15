<script lang="ts">
  import { BirthdayCakeIcon } from "@hugeicons/core-free-icons";

  import { birthdayModal } from "$lib/client/stores/modal";

  import type { Birthday } from "$lib/shared/types";

  import { Icon } from "../icons";

  interface Props {
    birthday: Birthday;
  }

  let { birthday }: Props = $props();

  const hasBirthdaySuffix = /birthday$/i.test(birthday.name.trim());
  const name = hasBirthdaySuffix ? birthday.name : `${birthday.name}'s birthday`;
  const color = $derived(birthday.color);
</script>

<button
  class="text-primary-content border-primary-content/10 flex w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-xl border p-0 text-left shadow-sm backdrop-blur-md select-none"
  style:background-color="{color}33"
  title={name}
  onclick={() => birthdayModal.handleModal(birthday)}
>
  <div class="h-full w-1 shrink-0" style:background-color={color}></div>
  <div class="w-full min-w-0 overflow-hidden p-0.5 text-xs font-medium">
    <div class="flex min-w-0 items-center gap-1">
      <Icon icon={BirthdayCakeIcon} size={13} absoluteStrokeWidth />
      <p class="truncate">{name}</p>
    </div>
  </div>
</button>
