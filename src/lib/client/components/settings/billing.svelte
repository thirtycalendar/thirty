<script lang="ts">
  import { onMount } from "svelte";
  import { PUBLIC_POLAR_PRODUCT_ID_PRO } from "$env/static/public";

  import { creditsQuery } from "$lib/client/data/queries/credit";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { authClient } from "$lib/client/utils/rpc";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { MessageLimitByPlan } from "$lib/shared/constants";
  import type { SubscriptionPlan } from "$lib/shared/types";

  const { data: credit } = creditsQuery();
  const usage: number = $derived($credit?.count ?? 0);

  let planName = $state<SubscriptionPlan>("free");
  let renewalDate = $state("");
  let price = $state(0);

  const isFree = $derived.by(() => planName === "free");
  const limit = $derived.by(() => MessageLimitByPlan[planName]);

  const persuasiveText = $derived.by(() =>
    isFree
      ? `Free gives you ${limit} messages/month. Upgrade to Pro for unlimited messaging — no limits, no interruptions.`
      : "You're on Pro — enjoy unlimited messaging with peace of mind every month."
  );

  onMount(async () => {
    const { data: customer } = await authClient.customer.state();
    const sub = customer?.activeSubscriptions?.[0];

    planName = sub?.productId === PUBLIC_POLAR_PRODUCT_ID_PRO ? "pro" : "free";
    renewalDate = sub?.endsAt?.toISOString() ?? "";
    price = sub?.amount ?? 0;
  });

  const {
    mutate: handleUpgrade,
    isPending: isUpgradePending,
    isSuccess: isUpgradeSuccess,
    isError: isUpgradeError
  } = createMutation({
    mutationFn: () => authClient.checkout({ products: [PUBLIC_POLAR_PRODUCT_ID_PRO] })
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

<div class="text-primary-content/70 flex flex-col gap-3">
  <div class="flex items-center justify-between">
    <div>
      <p class="">
        Current Plan ({capitalizeFirstLetter(planName)})
      </p>
      <p class="text-sm">
        {isFree ? "No renewal required" : `Active until ${renewalDate}`}
      </p>
    </div>

    <div class="text-right">
      <p class="text-2xl">
        {isFree ? "$0" : `$${price}`}
        <span class=" text-sm">/mo</span>
      </p>
    </div>
  </div>

  {#if isFree}
    <p class="text-sm">
      {usage} of free {limit} messages remaining for this month.
    </p>
  {/if}

  <p class="text-sm italic">{persuasiveText}</p>

  <div class="mt-3 flex flex-col gap-2">
    <button
      onclick={isFree ? handleUpgrade : handleBilling}
      class="btn btn-secondary w-full font-normal"
      disabled={isActionPending && !isActionError}
    >
      {#if isActionPending}
        <span class="loading loading-spinner loading-xs"></span>
      {/if}
      {isFree ? "Upgrade to Pro" : "Manage Billing"}
    </button>
  </div>
</div>
