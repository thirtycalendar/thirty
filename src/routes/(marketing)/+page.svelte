<script lang="ts">
  import { goto } from "$app/navigation";

  import { authClient } from "$lib/client/utils/rpc";

  import { polarProductIdsEnvConfig } from "$lib/shared/utils/env-config";

  async function handleCheckout() {
    await authClient.checkout({
      products: [polarProductIdsEnvConfig.pro]
    });
  }
</script>

<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <button class="btn" onclick={() => goto("/auth")}>Auth</button>

  <button class="btn" onclick={handleCheckout}>Checkout</button>
</div>
