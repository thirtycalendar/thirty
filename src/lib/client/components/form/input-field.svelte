<script lang="ts">
  import type { Writable } from "svelte/store";

  import { cn } from "$lib/client/utils/cn";

  interface Props {
    name: string;
    type?: string;
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
    type = "text",
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
  let value = $derived($formData[name] === "9999-12-31" ? "" : $formData[name]);
</script>

<fieldset class={cn("fieldset w-full basis-[49%]", fieldsetClassName)}>
  {#if legendText}
    <legend class={cn("fieldset-legend", legendClassName)}>{legendText}</legend>
  {/if}

  <input
    {type}
    {name}
    class={cn("input w-full focus:outline-none", error ? "input-error" : "", className)}
    oninput={handleInput}
    value={value ?? ""}
    {placeholder}
    {disabled}
    step={type === "number" ? "0.01" : undefined}
  />

  {#if error}
    <p class="fieldset-label text-error">{error || "This field is required"}</p>
  {/if}
</fieldset>
