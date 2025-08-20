<script lang="ts">
  import type { LegalSection } from "$lib/shared/types";
  import { legalConfig } from "$lib/shared/config";

  interface Props {
    title: string;
    sections: LegalSection[];
  }

  const { title, sections }: Props = $props();

  const { effectiveDate, productName, lastUpdatedDate } = legalConfig;
</script>

<div class="p-3">
  <h1 class="my-5 text-center text-xl sm:text-3xl">{title}</h1>
  <div class="my-5 flex flex-col space-y-2">
    <p>Effective Date: {effectiveDate}</p>
    <p>Last updated: {lastUpdatedDate}</p>
  </div>

  <div class="divider"></div>

  <div class="text-primary-content/70 flex flex-col space-y-8">
    {#each sections as section (section.title)}
      <h2 class="text-primary-content text-lg sm:text-xl">{section.title}</h2>
      {#each section.content as item (item)}
        {#if typeof item === "string"}
          <p>{item}</p>
        {:else if item.type === "link"}
          <a href={item.href}>{item.text}</a>
        {:else if item.type === "list"}
          <ul class="list-disc space-y-1 pl-6">
            {#each item.items as li (li)}<li>{li}</li>{/each}
          </ul>
        {:else if item.type === "pre"}
          <pre class="bg-base overflow-x-auto p-3 text-sm">{item.text}</pre>
        {/if}
      {/each}
    {/each}
  </div>

  <p class="mt-10 mb-15">
    By using the hosted version of {productName}, you consent to the practices described in this {title}.
  </p>
</div>
