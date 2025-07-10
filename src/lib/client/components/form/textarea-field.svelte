<script lang="ts">
  import type { Writable } from "svelte/store";

  import { cn } from "$lib/client/utils/cn";

  interface Props {
    name: string;
    legendText?: string;
    placeholder?: string;
    fieldsetClassName?: string;
    legendClassName?: string;
    className?: string;
    disabled?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
    handleInput: (event: Event) => void;
  }

  let {
    name,
    legendText,
    placeholder,
    fieldsetClassName,
    legendClassName,
    className,
    disabled,
    formData,
    formErrors,
    handleInput
  }: Props = $props();

  let error = $derived($formErrors[name]);
  let value = $derived($formData[name]);
</script>

<fieldset class={cn("fieldset w-full basis-[49%]", fieldsetClassName)}>
  {#if legendText}
    <legend class={cn("fieldset-legend", legendClassName)}>{legendText}</legend>
  {/if}

  <textarea
    {name}
    class={cn("textarea w-full focus:outline-none", error ? "input-error" : "", className)}
    oninput={handleInput}
    {value}
    {placeholder}
    {disabled}
    rows={8}
  ></textarea>

  {#if error}
    <p class="fieldset-label text-error">{error || "This field is required"}</p>
  {/if}
</fieldset>
