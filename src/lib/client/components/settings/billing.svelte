<script lang="ts">
  import { onMount } from "svelte";
  import { PUBLIC_POLAR_PRODUCT_ID_PRO } from "$env/static/public";

  import { format, parseISO } from "date-fns";

  import { checkoutMutation, portalMutation } from "$lib/client/data/mutations";
  import { creditsQuery } from "$lib/client/data/queries/credit";
  import { authClient } from "$lib/client/utils/rpc";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { MessageLimitByPlan } from "$lib/shared/constants";
  import type { SubscriptionPlan } from "$lib/shared/types";

  const { data: credit } = creditsQuery();
  const usage: number = $derived($credit?.count ?? 0);

  let planName = $state<SubscriptionPlan>("free");
  let renewalDate = $state("");
  // let price = $state(0);

  const isFree = $derived.by(() => planName === "free");
  const limit = $derived.by(() => MessageLimitByPlan[planName]);

  const persuasiveText = $derived.by(() =>
    isFree
      ? "Upgrade to Pro for unlimited messaging — no limits, zero stress."
      : "You're on Pro — unlimited messaging, zero stress."
  );

  onMount(async () => {
    const { data: customer } = await authClient.customer.state();
    const sub = customer?.activeSubscriptions?.[0];

    planName = sub?.productId === PUBLIC_POLAR_PRODUCT_ID_PRO ? "pro" : "free";
    renewalDate = sub?.currentPeriodEnd?.toISOString() ?? "";
    // price = sub?.amount ?? 0;
  });

  const {
    mutate: handleUpgrade,
    isPending: isUpgradePending,
    isSuccess: isUpgradeSuccess,
    isError: isUpgradeError
  } = checkoutMutation();

  const {
    mutate: handleBilling,
    isPending: isPortalPending,
    isSuccess: isPortalSuccess,
    isError: isPortalError
  } = portalMutation();

  const isActionPending = $derived.by(() =>
    isFree ? $isUpgradePending || $isUpgradeSuccess : $isPortalPending || $isPortalSuccess
  );

  const isActionError = $derived.by(() => (isFree ? $isUpgradeError : $isPortalError));
</script>

<div class="text-primary-content/80 mt-2 flex flex-col gap-4">
  <!-- Plan status -->
  <div class="flex items-center justify-between">
    <div>
      <p class="font-medium">
        Plan:
        <span class="text-primary-content font-semibold">
          {capitalizeFirstLetter(planName)}
        </span>
      </p>
      <p class="text-primary-content/60 mt-1 text-xs">
        {isFree
          ? "No renewal required"
          : `Renews on ${format(parseISO(renewalDate), "MMM d, yyyy")}`}
      </p>
    </div>

    {#if !isFree}
      <div class="text-right">
        <p class="badge badge-success badge-sm px-3 py-1">Active</p>
        <p class="text-primary-content/60 mt-1 text-xs">Billed monthly</p>
      </div>
    {/if}
  </div>

  {#if isFree}
    <div class="bg-base-200 border-rounded px-3 py-2 text-sm">
      <p>
        You've used <span class="font-semibold">{usage}</span> of your
        <span class="font-semibold">{limit}</span> free messages this month.
      </p>
      <p class="text-error mt-2">Only {limit - usage} left - don't run out!</p>
    </div>
  {/if}

  <hr class="text-base-200" />

  <div class="text-center">
    <p class="text-sm leading-relaxed italic">
      {persuasiveText}
    </p>
  </div>

  <div class="mt-2 flex flex-col gap-2">
    <button
      onclick={isFree ? handleUpgrade : handleBilling}
      class="btn btn-accent w-full font-medium shadow-md transition hover:shadow-lg"
      disabled={isActionPending && !isActionError}
    >
      {#if isActionPending}
        <span class="loading loading-spinner loading-sm"></span>
      {/if}
      {isFree ? "Upgrade to Pro" : "Manage Billing"}
    </button>

    {#if isFree}
      <p class="text-primary-content/60 text-center text-xs">
        Cancel anytime. Secure checkout powered by Polar.
      </p>
    {/if}
  </div>
</div>
