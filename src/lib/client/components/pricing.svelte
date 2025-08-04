<script lang="ts">
  import { goto } from "$app/navigation";

  import { Check } from "@lucide/svelte";

  import { authClient } from "../utils/rpc";

  const tiers = [
    {
      name: "Free",
      id: "",
      price: "$0 / month",
      features: [
        "25 AI messages / month",
        "1 connected calendar",
        "Basic scheduling features",
        "AI summaries (limited)"
      ],
      featured: false
    },
    {
      name: "Pro",
      id: "",
      price: "$15 / month",
      features: [
        "Unlimited AI for daily use (fair use ~1,500 messages / month)",
        "Unlimited calendars",
        "Advanced AI features (planning, prioritization, natural language scheduling)",
        "Priority support"
      ],
      featured: true
    }
  ];

  let isProcessing = $state(false);

  async function onclick(productId: string) {
    isProcessing = true;

    try {
      const session = await authClient.getSession();

      if (!session.data?.session) {
        goto("/auth");
        return;
      }

      if (session.data?.user) {
        window.location.href = `/api/polar/checkout?productId=${productId}&customerExternalId=${session.data.user.id}`;
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

<section
  id="pricing"
  class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center p-4"
>
  <div class="mb-10 text-center">
    <h1 class="text-3xl font-bold">Simple, Transparent Pricing</h1>
    <p class="mt-4 text-lg">Choose the plan that fits your schedule.</p>
  </div>

  <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
    {#each tiers as tier (tier.id)}
      <div
        class="card border shadow-lg {tier.featured
          ? 'border-primary-content'
          : 'border-secondary-content/80'}"
      >
        <div class="card-body">
          <h2 class="card-title {tier.featured ? 'text-primary' : 'text-base-content'}">
            {tier.name}
          </h2>
          <p class="mt-2 text-xl font-bold md:text-4xl">{tier.price}</p>
          <ul class="mt-10 list-none space-y-2">
            {#each tier.features as feature (feature)}
              <li class="flex items-center">
                <Check class="text-primary-conent mr-2 h-5 w-5" />
                {feature}
              </li>
            {/each}
          </ul>
          <button
            class="btn mt-6 {tier.featured ? 'btn-outline' : 'btn-ghost'}"
            onclick={() => onclick(tier.id)}
            disabled={isProcessing}
          >
            Get started
          </button>
        </div>
      </div>
    {/each}
  </div>
</section>
