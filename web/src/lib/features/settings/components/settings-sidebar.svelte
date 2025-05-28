<script lang="ts">
  import {
    MessageCircleMore,
    ReceiptText,
    Settings2,
    SunMoon,
    TriangleAlert
  } from "@lucide/svelte";

  const links = [
    { href: "/", icon: Settings2, label: "General" },
    { href: "/pricing", icon: SunMoon, label: "Appearance" },
    { href: "/billing", icon: ReceiptText, label: "Billing" },
    { href: "/feedback", icon: MessageCircleMore, label: "Feedback" },
    { href: "/delete-account", icon: TriangleAlert, label: "Delete Account" }
  ];
</script>

<div class="flex flex-col mt-5">
  {#each links as { href, icon: Icon, label }}
    <a {href} class="flex items-center gap-3 text-sm p-2 w-full hover:bg-base-200 rounded-lg">
      <Icon size="17" strokeWidth="2.5" />
      {label}
    </a>
  {/each}
</div>
