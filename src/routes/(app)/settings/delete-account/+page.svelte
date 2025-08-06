<script lang="ts">
  import { DeleteAccount, Navbar } from "$lib/client/features/settings/components";
  import { Seo } from "$lib/client/components";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<Navbar title="Delete Account" />

<DeleteAccount />
