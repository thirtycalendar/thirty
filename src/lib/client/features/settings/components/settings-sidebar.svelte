<script lang="ts">
  import { page } from "$app/state";

  import {
    MessageCircleMore,
    Milestone,
    ReceiptText,
    RefreshCcw,
    SunMoon,
    TriangleAlert
  } from "@lucide/svelte";

  import { UserProfile } from "$lib/client/features/auth/components";

  const links = [
    { href: "billing", icon: ReceiptText, label: "Billing" },
    { href: "sync", icon: RefreshCcw, label: "Sync" },
    { href: "appearance", icon: SunMoon, label: "Appearance" },
    { href: "roadmap", icon: Milestone, label: "Roadmap" },
    { href: "feedback", icon: MessageCircleMore, label: "Feedback" },
    { href: "delete-account", icon: TriangleAlert, label: "Delete Account" }
  ];

  const activePath = $derived(page.url.pathname);
</script>

<div class="mt-5 flex flex-col">
  <UserProfile />

  {#each links as { href, icon: Icon, label } (href)}
    <a
      href={`/settings/${href}`}
      class="hover:bg-base-200/80 flex w-full items-center gap-3 rounded-lg p-2 text-sm {activePath ===
        `/settings/${href}` && 'bg-base-200'}"
    >
      <Icon size="17" strokeWidth="2.5" />
      {label}
    </a>
  {/each}
</div>
