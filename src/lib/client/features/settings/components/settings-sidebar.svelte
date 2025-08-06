<script lang="ts">
  import { page } from "$app/state";

  import {
    ExternalLink,
    MessageCircleMore,
    Milestone,
    ReceiptText,
    RefreshCcw,
    TriangleAlert
  } from "@lucide/svelte";

  import { UserProfile } from "$lib/client/features/auth/components";

  const links = [
    { href: "billing", icon: ReceiptText, label: "Billing" },
    { href: "sync", icon: RefreshCcw, label: "Sync" },
    // { href: "appearance", icon: SunMoon, label: "Appearance" },
    { href: "feedback", icon: MessageCircleMore, label: "Feedback" },
    { href: "https://thirty.userjot.com/roadmap", icon: Milestone, label: "Roadmap" },
    { href: "delete-account", icon: TriangleAlert, label: "Delete Account" }
  ];

  const activePath = $derived(page.url.pathname);
</script>

<div class="mt-5 flex flex-col">
  <UserProfile />

  {#each links as { href, icon: Icon, label } (href)}
    {#if href.startsWith("http")}
      <a
        {href}
        class="hover:bg-base-200/80 flex w-full items-center justify-between gap-3 rounded-lg p-2 text-sm"
        target="_blank"
      >
        <div class="flex gap-3">
          <Icon size="17" strokeWidth="2.5" />
          {label}
        </div>

        <ExternalLink size="17" strokeWidth="1" class="text-accent-content" />
      </a>
    {:else}
      <a
        href={`/settings/${href}`}
        class="hover:bg-base-200/80 flex w-full items-center gap-3 rounded-lg p-2 text-sm {activePath ===
          `/settings/${href}` && 'bg-base-200'}"
      >
        <Icon size="17" strokeWidth="2.5" />
        {label}
      </a>
    {/if}
  {/each}
</div>
