<script lang="ts">
  import { page } from "$app/state";

  import {
    MessageCircleMore,
    ReceiptText,
    Settings2,
    SunMoon,
    TriangleAlert
  } from "@lucide/svelte";

  const links = [
    { href: "general", icon: Settings2, label: "General" },
    { href: "appearance", icon: SunMoon, label: "Appearance" },
    { href: "billing", icon: ReceiptText, label: "Billing" },
    { href: "feedback", icon: MessageCircleMore, label: "Feedback" },
    { href: "delete-account", icon: TriangleAlert, label: "Delete Account" }
  ];

  let activePath = $derived(page.url.pathname);
</script>

<div class="flex flex-col mt-5">
  {#each links as { href, icon: Icon, label }}
    <a
      href={`/settings/${href}`}
      class="flex items-center gap-3 text-sm p-2 w-full rounded-lg
          hover:bg-base-200/80
          {activePath === `/settings/${href}` ? 'bg-base-200' : ''}"
    >
      <Icon size="17" strokeWidth="2.5" />
      {label}
    </a>
  {/each}
</div>
