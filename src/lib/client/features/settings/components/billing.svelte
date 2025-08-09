<script lang="ts">
  import { onMount } from "svelte";

  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { authClient } from "$lib/client/utils/rpc";

  import { polarProductIdsEnvConfig } from "$lib/shared/utils/env-config";
  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { MessageLimitByPlan } from "$lib/shared/constants";
  import type { SubscriptionPlan } from "$lib/shared/types";

  import { getCredit } from "../query";

  const { data: credit } = getCredit();
  const usage: number = $derived($credit?.count ?? 0);

  let planName = $state<SubscriptionPlan>("free");
  let renewalDate = $state("");
  let price = $state(20);

  const isFree = $derived.by(() => planName === "free");
  const limit = $derived.by(() => MessageLimitByPlan[planName]);
  const percentage = $derived.by(() => Math.min(100, (usage / limit) * 100));

  const persuasiveText = $derived.by(() =>
    isFree
      ? `Upgrade to Pro and unlock ~${MessageLimitByPlan.pro} messages/month, faster sync, and a smoother experience.`
      : `You're on Pro - enjoy ~${MessageLimitByPlan.pro} messages/month with uninterrupted productivity.`
  );

  onMount(async () => {
    const { data: customer } = await authClient.customer.state();
    const sub = customer?.activeSubscriptions?.[0];

    planName = sub?.productId === polarProductIdsEnvConfig.pro ? "pro" : "free";
    renewalDate = sub?.endsAt?.toISOString() ?? "";
    price = sub?.amount ?? 0;
  });

  const {
    mutate: handleUpgrade,
    isPending: isUpgradePending,
    isSuccess: isUpgradeSuccess,
    isError: isUpgradeError
  } = createMutation({
    mutationFn: () => authClient.checkout({ products: [polarProductIdsEnvConfig.pro] })
  });

  const {
    mutate: handleBilling,
    isPending: isPortalPending,
    isSuccess: isPortalSuccess,
    isError: isPortalError
  } = createMutation({
    mutationFn: () => authClient.customer.portal()
  });

  const isActionPending = $derived.by(() =>
    isFree ? $isUpgradePending || $isUpgradeSuccess : $isPortalPending || $isPortalSuccess
  );

  const isActionError = $derived.by(() => (isFree ? $isUpgradeError : $isPortalError));
</script>

<div class="flex w-full max-w-xl flex-col gap-4 py-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-primary-content font-bold">
        Current Plan ({capitalizeFirstLetter(planName)})
      </p>
      <p class="text-primary-content/70 text-sm">
        {isFree ? "No renewal required" : `Active until ${renewalDate}`}
      </p>
    </div>

    <div class="text-right">
      <p class="text-primary-content text-2xl font-bold">
        {isFree ? "$0" : `$${price}`}
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
    <button
      onclick={isFree ? handleUpgrade : handleBilling}
      class="btn btn-primary w-full"
      disabled={isActionPending && !isActionError}
    >
      {#if isActionPending}
        <span class="loading loading-spinner loading-xs"></span>
      {/if}
      {isFree ? "Upgrade to Pro" : "Manage Billing"}
    </button>

    <p class="text-primary-content/50 text-center text-xs">
      Secure payments powered by <span class="font-semibold">Polar</span>
    </p>
  </div>
</div>
