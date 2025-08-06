<script lang="ts">
  interface Props {
    planName: "Free" | "Pro";
    renewalDate: string;
    price: number;
    usage: number;
    limit: number;
  }

  let {
    planName = "Free",
    renewalDate = "25 Jan 2027",
    price = 20,
    usage = 100,
    limit = 1500
  }: Props = $props();

  const percentage = Math.min(100, (usage / limit) * 100);

  const persuasiveText =
    planName === "Free"
      ? "Upgrade to Pro and unlock ~1500 messages each month, faster sync, and a smoother experience without hitting limits."
      : "You're on Pro – enjoy ~1500 messages every month and uninterrupted productivity. Stay on Pro to keep everything running effortlessly.";

  function manageBilling() {
    // handle manage billing
  }
</script>

<div class="flex w-full max-w-xl flex-col gap-4 p-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-primary-content font-bold">Current Plan ({planName})</p>
      <p class="text-primary-content/70 text-sm">
        {planName === "Free" ? "No renewal required" : `Active until ${renewalDate}`}
      </p>
    </div>
    <div class="text-right">
      <p class="text-primary-content text-2xl font-bold">
        {planName === "Free" ? "$0" : `$${price}`}
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
    <button onclick={manageBilling} class="btn btn-primary w-full">
      {planName === "Free" ? "Upgrade to Pro" : "Manage Billing"}
    </button>
    <p class="text-primary-content/50 text-center text-xs">
      Secure payments powered by <span class="font-semibold">Polar</span>
    </p>
  </div>
</div>
