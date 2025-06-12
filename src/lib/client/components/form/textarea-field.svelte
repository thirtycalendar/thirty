<script lang="ts">
  import { cn } from "$lib/client/utils/cn";

  interface InputFieldProps {
    name: string;
    legendText?: string;
    placeholder?: string;
    fieldsetClassName?: string;
    legendClassName?: string;
    className?: string;
    disabled?: boolean;
    formData: any;
    formErrors: any;
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
  }: InputFieldProps = $props();

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
