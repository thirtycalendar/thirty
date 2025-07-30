<script lang="ts">
  import { page } from "$app/state";

  import {
    MessageCircleMore,
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
    { href: "feedback", icon: MessageCircleMore, label: "Feedback" },
    { href: "delete-account", icon: TriangleAlert, label: "Delete Account" }
  ];

  const activePath = $derived(page.url.pathname);
</script>

<div class="flex flex-col mt-5">
  <UserProfile />

  {#each links as { href, icon: Icon, label } (href)}
    <a
      href={`/settings/${href}`}
      class="flex items-center gap-3 text-sm p-2 w-full rounded-lg hover:bg-base-200/80 {activePath ===
        `/settings/${href}` && 'bg-base-200'}"
    >
      <Icon size="17" strokeWidth="2.5" />
      {label}
    </a>
  {/each}
</div>
