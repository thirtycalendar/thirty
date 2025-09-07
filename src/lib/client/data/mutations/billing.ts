import { PUBLIC_POLAR_PRODUCT_ID_PRO } from "$env/static/public";

import { createMutation } from "$lib/client/utils/query/create-mutation";
import { authClient } from "$lib/client/utils/rpc";

export function checkoutMutation() {
  return createMutation({
    mutationFn: () => authClient.checkout({ products: [PUBLIC_POLAR_PRODUCT_ID_PRO] })
  });
}

export function portalMutation() {
  return createMutation({
    mutationFn: () => authClient.customer.portal()
  });
}
