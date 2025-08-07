<script lang="ts">
  import { onMount } from "svelte";

  import { authClient } from "$lib/client/utils/rpc";

  import { polarProductIdsEnvConfig } from "$lib/shared/utils/env-config";
  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { MessageLimitByPlan } from "$lib/shared/constants";
  import type { SubscriptionPlan } from "$lib/shared/types";

  let usage = 14; // just a placeholder, will update later

  let planName = $state<SubscriptionPlan>("free");
  let renewalDate = $state("");
  let price = $state(20);
  let limit = $derived(planName === "free" ? MessageLimitByPlan.free : MessageLimitByPlan.pro);

  const percentage = $derived(Math.min(100, (usage / limit) * 100));

  const persuasiveText = $derived(
    planName === "free"
      ? `Upgrade to Pro and unlock ~${MessageLimitByPlan.pro} messages each month, faster sync, and a smoother experience without hitting limits.`
      : `You're on Pro - enjoy ~${MessageLimitByPlan.pro} messages every month and uninterrupted productivity. Stay on Pro to keep everything running effortlessly.`
  );

  onMount(async () => {
    const { data: customerState } = await authClient.customer.state();

    planName =
      customerState?.activeSubscriptions[0].productId === polarProductIdsEnvConfig.pro
        ? "pro"
        : "free";
    renewalDate = customerState?.activeSubscriptions[0].endsAt?.toISOString() || "";
    price = customerState?.activeSubscriptions[0].amount || 0;
  });

  async function handleUpgradeToPro() {
    await authClient.checkout({
      products: [polarProductIdsEnvConfig.pro]
    });
  }

  async function handleManageBilling() {
    await authClient.customer.portal();
  }
</script>

<div class="flex w-full max-w-xl flex-col gap-4 py-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-primary-content font-bold">Current Plan ({capitalizeFirstLetter(planName)})</p>
      <p class="text-primary-content/70 text-sm">
        {planName === "free" ? "No renewal required" : `Active until ${renewalDate}`}
      </p>
    </div>
    <div class="text-right">
      <p class="text-primary-content text-2xl font-bold">
        {planName === "free" ? "$0" : `$${price}`}
        <span class="text-primary-content/70 text-sm">/mo</span>
      </p>
    </div>
  </div>

  <div>
    <p class="text-primary-content/70 mb-2 text-sm">
      {usage} of {limit} messages remaining
    </p>
    <progress class="progress w-full" value={percentage} max="100"></progress>
  </div>

  <p class="text-primary-content/80 text-sm italic">{persuasiveText}</p>

  <div class="mt-3 flex flex-col gap-2">
    {#if planName == "free"}
      <button onclick={handleUpgradeToPro} class="btn btn-primary w-full">Upgrade to Pro</button>
    {:else}
      <button onclick={handleManageBilling} class="btn btn-primary w-full">Manage Billing</button>
    {/if}

    <p class="text-primary-content/50 text-center text-xs">
      Secure payments powered by <span class="font-semibold">Polar</span>
    </p>
  </div>
</div>
