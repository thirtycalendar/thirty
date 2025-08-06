<script lang="ts">
  import { Bug, CreditCard, Sparkles, Users } from "@lucide/svelte";

  const feedbackItems = [
    {
      icon: Sparkles,
      title: "Got a feature in mind?",
      description: "Help shape Thirty with your ideas or vote on what we build next.",
      href: "https://thirty.userjot.com/board/features"
    },
    {
      icon: Bug,
      title: "Found a bug?",
      description: "Minor bugs, visual quirks, or weird behavior? Let us know.",
      href: "https://thirty.userjot.com/board/bugs"
    },
    {
      icon: CreditCard,
      title: "Need help with your account?",
      description: "Questions about billing or account access? Reach us anytime.",
      href: "mailto:sithuknt@gmail.com"
    },
    {
      icon: Users,
      title: "Join our community",
      description: "Connect with other users and the team on Discord.",
      href: "https://discord.gg/Y8XQ4dV4UC"
    }
  ];
</script>

<div class="flex w-full max-w-xl flex-col gap-4 p-4">
  {#each feedbackItems as { icon: Icon, title, description, href } (href)}
    <a
      {href}
      class="bg-base-100 hover:bg-base-300 flex items-center gap-5 rounded-lg p-3 px-5 transition"
      target={href.startsWith("mailto:") ? "" : "_blank"}
    >
      <Icon class="text-primary-conent h-5 w-5" />
      <div>
        <p class="text-primary-content font-semibold">{title}</p>
        <p class="text-primary-content/70 text-sm">{description}</p>
      </div>
    </a>
  {/each}
</div>
